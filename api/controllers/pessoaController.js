import { Pessoa } from '../../mvc/models/index.js';
import { Op } from 'sequelize';
import { generateToken } from '../middlewares/authMiddleware.js';

/**
 * Controller de Pessoas (Usuários)
 * Implementa CRUD completo seguindo padrão REST
 */
export default {
    /**
     * POST /api/pessoas
     * Cria um novo usuário
     */
    async create(req, res) {
        try {
            const { nome_pessoa, cpf, email, senha, tipo_usuario } = req.body;

            // Validação dos campos obrigatórios
            if (!nome_pessoa || !cpf || !email || !senha || !tipo_usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor, preencha todos os campos obrigatórios.'
                });
            }

            // Validação do CPF (deve ter 11 dígitos numéricos)
            const cpfLimpo = cpf.replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                return res.status(400).json({
                    success: false,
                    message: 'CPF deve conter exatamente 11 dígitos numéricos.'
                });
            }

            // Verifica se já existe um usuário com o mesmo CPF ou email
            const pessoaExistente = await Pessoa.findOne({
                where: {
                    [Op.or]: [
                        { cpf: cpfLimpo },
                        { email: email }
                    ]
                }
            });

            if (pessoaExistente) {
                if (pessoaExistente.cpf === cpfLimpo) {
                    return res.status(409).json({
                        success: false,
                        message: 'CPF já cadastrado.'
                    });
                }
                if (pessoaExistente.email === email) {
                    return res.status(409).json({
                        success: false,
                        message: 'E-mail já cadastrado.'
                    });
                }
            }

            // Cria a pessoa
            const novaPessoa = await Pessoa.create({
                nome_pessoa,
                cpf: cpfLimpo,
                email,
                senha,
                tipo_usuario,
                frete_fixo: tipo_usuario === 'VENDEDOR' ? 0.00 : null
            });

            // Remove a senha da resposta
            const pessoaResponse = {
                id: novaPessoa.id_pessoa,
                nome_pessoa: novaPessoa.nome_pessoa,
                email: novaPessoa.email,
                tipo_usuario: novaPessoa.tipo_usuario,
                frete_fixo: novaPessoa.frete_fixo
            };

            return res.status(201).json({
                success: true,
                message: 'Usuário cadastrado com sucesso!',
                data: pessoaResponse
            });
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao cadastrar pessoa.',
                error: error.message
            });
        }
    },

    /**
     * POST /api/pessoas/login
     * Autentica um usuário e retorna token JWT
     */
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor, preencha todos os campos.'
                });
            }

            const pessoa = await Pessoa.findOne({ where: { email } });

            if (!pessoa || pessoa.senha !== senha) {
                return res.status(401).json({
                    success: false,
                    message: 'E-mail ou senha inválidos.'
                });
            }

            // Gera token JWT
            const token = generateToken(pessoa.id_pessoa, pessoa.email, pessoa.tipo_usuario);

            return res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                data: {
                    token,
                    user: {
                        id: pessoa.id_pessoa,
                        nome: pessoa.nome_pessoa,
                        email: pessoa.email,
                        role: pessoa.tipo_usuario,
                        frete_fixo: pessoa.frete_fixo
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao fazer login.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/pessoas/me
     * Retorna dados do usuário autenticado
     */
    async getMe(req, res) {
        try {
            const pessoa = await Pessoa.findByPk(req.user.id, {
                attributes: ['id_pessoa', 'nome_pessoa', 'email', 'tipo_usuario', 'frete_fixo']
            });

            if (!pessoa) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado.'
                });
            }

            return res.json({
                success: true,
                data: pessoa
            });
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar dados do usuário.',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/pessoas/me
     * Atualiza dados do usuário autenticado
     */
    async updateMe(req, res) {
        try {
            const { nome_pessoa, email } = req.body;

            const [updated] = await Pessoa.update(
                { nome_pessoa, email },
                { 
                    where: { id_pessoa: req.user.id },
                    returning: true
                }
            );

            if (updated === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado.'
                });
            }

            const pessoaAtualizada = await Pessoa.findByPk(req.user.id, {
                attributes: ['id_pessoa', 'nome_pessoa', 'email', 'tipo_usuario', 'frete_fixo']
            });

            return res.json({
                success: true,
                message: 'Dados atualizados com sucesso!',
                data: pessoaAtualizada
            });
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar dados.',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/pessoas/me/senha
     * Atualiza senha do usuário autenticado
     */
    async updatePassword(req, res) {
        try {
            const { senhaAtual, novaSenha, confirmarSenha } = req.body;

            const pessoa = await Pessoa.findByPk(req.user.id);

            if (!pessoa) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado.'
                });
            }

            if (pessoa.senha !== senhaAtual) {
                return res.status(400).json({
                    success: false,
                    message: 'Senha atual incorreta.'
                });
            }

            if (novaSenha !== confirmarSenha) {
                return res.status(400).json({
                    success: false,
                    message: 'A nova senha e a confirmação não coincidem.'
                });
            }

            await Pessoa.update(
                { senha: novaSenha },
                { where: { id_pessoa: req.user.id } }
            );

            return res.json({
                success: true,
                message: 'Senha atualizada com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar senha.',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/pessoas/me/frete
     * Atualiza frete fixo do vendedor autenticado
     */
    async updateFrete(req, res) {
        try {
            if (req.user.role !== 'VENDEDOR') {
                return res.status(403).json({
                    success: false,
                    message: 'Apenas vendedores podem configurar frete.'
                });
            }

            const { frete_fixo } = req.body;

            const pessoa = await Pessoa.findByPk(req.user.id);
            if (!pessoa) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado.'
                });
            }

            const [updated] = await Pessoa.update(
                { frete_fixo: frete_fixo || 0 },
                { where: { id_pessoa: req.user.id } }
            );

            if (updated === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Não foi possível atualizar o frete.'
                });
            }

            const pessoaAtualizada = await Pessoa.findByPk(req.user.id, {
                attributes: ['id_pessoa', 'nome_pessoa', 'email', 'tipo_usuario', 'frete_fixo']
            });

            return res.json({
                success: true,
                message: 'Frete atualizado com sucesso!',
                data: pessoaAtualizada
            });
        } catch (error) {
            console.error('Erro ao atualizar frete:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar frete.',
                error: error.message
            });
        }
    }
};

