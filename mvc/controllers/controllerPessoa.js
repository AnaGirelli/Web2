import { Pessoa } from '../models/index.js';

export default {

    // =============================================================
    // LOGIN - Autenticação
    // =============================================================
    async authenticate(req, res) {
        try {
            const { email, senha } = req.body; // Captura dados do formulário

            const pessoa = await Pessoa.findOne({ where: { email } }); // Busca usuário pelo e-mail
            // Verifica se o usuário existe e se a senha está correta
            if (!pessoa || pessoa.senha !== senha) {
                return res.render('login', { error: 'E-mail ou senha inválidos' });
            }

            // Salva na sessão
            req.session.isAuthenticated = true;
            req.session.userId = pessoa.id_pessoa;
            req.session.userName = pessoa.nome_pessoa;
            req.session.userEmail = pessoa.email;
            req.session.userRole = pessoa.tipo_usuario;

            return res.redirect('/home'); //Direciona para a home após login bem-sucedido

        } catch (error) {
            console.error('Erro de autenticação:', error);
            return res.render('login', { error: 'Erro interno do servidor.' });
        }
    },



    // =============================================================
    // ATUALIZAR NOME + EMAIL DO USUÁRIO LOGADO
    // PUT /pessoa/cadastro
    // =============================================================
    async putCadastro(req, res) {
        const userId = req.session.userId; //Assume o ID da sessão

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
        }

        try {
            const { nome_pessoa, email } = req.body;
            //Tenta realizar o update
            const [updated] = await Pessoa.update(
                { nome_pessoa, email },
                { where: { id_pessoa: userId } }
            );
            // Se nenhum registro foi encontrado/atualizado
            if (updated === 0) {
                return res.status(404).json({ success: false, message: 'Cadastro não encontrado.' });
            }
            // Atualiza os dados na sessão
            req.session.userName = nome_pessoa;
            req.session.userEmail = email;

            return res.json({ success: true, message: 'Cadastro atualizado com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar cadastro:', error);
            return res.status(500).json({ success: false, message: 'Erro interno ao atualizar cadastro.', details: error.message });
        }
    },



    // =============================================================
    // ATUALIZAR SENHA
    // PUT /pessoa/senha
    // =============================================================
    async putSenha(req, res) {
        const userId = req.session.userId; //Assume o ID da sessão

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
        }

        try {
            const { senhaAtual, novaSenha, confirmarSenha } = req.body;

            const pessoa = await Pessoa.findByPk(userId);
            //Validações antes de atualizar no banco
            if (!pessoa) {
                return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
            }

            if (pessoa.senha !== senhaAtual) {
                return res.status(400).json({ success: false, message: 'Senha atual incorreta.' });
            }

            if (novaSenha !== confirmarSenha) {
                return res.status(400).json({ success: false, message: 'A nova senha e a confirmação não coincidem.' });
            }

            // Atualiza a senha no banco de dados
            const [updated] = await Pessoa.update(
            { senha: novaSenha },
            { where: { id_pessoa: userId } }
            );
            // Se nenhum registro foi encontrado/atualizado
            if (updated === 0) {
                return res.status(404).json({ success: false, message: 'Senha não atualizada.' });
            }

            return res.json({ success: true, message: 'Senha redefinida com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            return res.status(500).json({ success: false, message: 'Erro interno ao redefinir senha.', details: error.message });
        }
    },



    // =============================================================
    // CADASTRAR NOVO USUÁRIO
    // POST /pessoa
    // =============================================================
    async postPessoa(req, res) {
        try {
            const novaPessoa = await Pessoa.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Pessoa cadastrada com sucesso!',
                data: novaPessoa
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao cadastrar pessoa',
                details: error.message
            });
        }
    },



    // =============================================================
    // DELETAR USUÁRIO POR ID
    // DELETE /pessoa/:id
    // =============================================================
    async deletePessoa(req, res) {
        try {
            const deletado = await Pessoa.destroy({
                where: { id_pessoa: req.params.id }
            });

            if (deletado === 0) {
                return res.status(404).json({ success: false, message: 'Pessoa não encontrada para exclusão' });
            }

            // Logout automático após excluir o usuário
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({
                        success: true,
                        message: 'Usuário deletado, mas falha ao encerrar sessão.',
                        error: err
                    });
                }
                return res.redirect('/login');
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao deletar pessoa',
                details: error.message
            });
        }
    }

};