import { Produto, Categoria, UnidadeMedida } from '../../mvc/models/index.js';
import { Op } from 'sequelize';

/**
 * Controller de Produtos
 * Implementa CRUD completo seguindo padrão REST
 */
export default {
    /**
     * GET /api/produtos
     * Lista todos os produtos ativos (público)
     */
    async list(req, res) {
        try {
            const { categoria, busca } = req.query;
            
            // Construir condições where
            const whereConditions = [];
            
            // Sempre filtrar por ativo
            whereConditions.push({ ativo: true });
            
            // Adicionar filtro de categoria se fornecido
            if (categoria) {
                whereConditions.push({ id_categoria: parseInt(categoria) });
            }
            
            // Se há busca, adicionar condições de busca
            if (busca) {
                whereConditions.push({
                    [Op.or]: [
                        { nome_produto: { [Op.iLike]: `%${busca}%` } },
                        { descricao: { [Op.iLike]: `%${busca}%` } }
                    ]
                });
            }
            
            // Se há múltiplas condições, usar Op.and, senão usar o objeto direto
            const where = whereConditions.length > 1 
                ? { [Op.and]: whereConditions }
                : whereConditions[0];

            const produtos = await Produto.findAll({
                where,
                order: [['id_produto', 'DESC']]
            });

            return res.json({
                success: true,
                data: produtos
            });
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar produtos.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/produtos/:id
     * Busca um produto específico por ID (público)
     */
    async getById(req, res) {
        try {
            const { id } = req.params;

            const produto = await Produto.findByPk(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            return res.json({
                success: true,
                data: produto
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar produto.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/produtos/vendedor/meus-produtos
     * Lista produtos do vendedor autenticado
     */
    async listMyProducts(req, res) {
        try {
            const produtos = await Produto.findAll({
                where: { id_vendedor: req.user.id },
                order: [['id_produto', 'DESC']]
            });

            return res.json({
                success: true,
                data: produtos
            });
        } catch (error) {
            console.error('Erro ao listar produtos do vendedor:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar produtos.',
                error: error.message
            });
        }
    },

    /**
     * POST /api/produtos
     * Cria um novo produto (apenas vendedores)
     */
    async create(req, res) {
        try {
            const { nome_produto, descricao, preco, estoque, id_categoria, id_unidade_medida, url_imagem } = req.body;

            if (!nome_produto || !preco || !id_unidade_medida) {
                return res.status(400).json({
                    success: false,
                    message: 'Preencha todos os campos obrigatórios (nome_produto, preco, id_unidade_medida).'
                });
            }

            if (typeof estoque !== 'undefined' && estoque < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Estoque não pode ser negativo.'
                });
            }

            const novoProduto = await Produto.create({
                nome_produto,
                descricao: descricao || null,
                preco,
                estoque: estoque || 0,
                id_categoria: id_categoria || null,
                id_unidade_medida,
                url_imagem: url_imagem || null,
                id_vendedor: req.user.id,
                ativo: true
            });

            return res.status(201).json({
                success: true,
                message: 'Produto cadastrado com sucesso!',
                data: novoProduto
            });
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao cadastrar produto.',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/produtos/:id
     * Atualiza um produto (apenas o vendedor dono)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome_produto, descricao, preco, estoque, id_categoria, id_unidade_medida, url_imagem, ativo } = req.body;

            const produto = await Produto.findOne({
                where: { id_produto: id, id_vendedor: req.user.id }
            });

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado ou você não tem permissão para editá-lo.'
                });
            }

            // Validações
            if (nome_produto && (!preco || !id_unidade_medida)) {
                return res.status(400).json({
                    success: false,
                    message: 'Ao atualizar nome, preco e id_unidade_medida são obrigatórios.'
                });
            }

            if (typeof estoque !== 'undefined' && estoque < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Estoque não pode ser negativo.'
                });
            }

            // Atualiza apenas os campos fornecidos
            const updateData = {};
            if (typeof nome_produto !== 'undefined') updateData.nome_produto = nome_produto;
            if (typeof descricao !== 'undefined') updateData.descricao = descricao;
            if (typeof preco !== 'undefined') updateData.preco = preco;
            if (typeof estoque !== 'undefined') updateData.estoque = estoque;
            if (typeof id_categoria !== 'undefined') updateData.id_categoria = id_categoria;
            if (typeof id_unidade_medida !== 'undefined') updateData.id_unidade_medida = id_unidade_medida;
            if (typeof url_imagem !== 'undefined') updateData.url_imagem = url_imagem;
            if (typeof ativo !== 'undefined') updateData.ativo = ativo;

            await produto.update(updateData);

            return res.json({
                success: true,
                message: 'Produto atualizado com sucesso!',
                data: produto
            });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar produto.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/categorias
     * Lista todas as categorias (público)
     */
    async listCategorias(req, res) {
        try {
            const categorias = await Categoria.findAll({
                order: [['id_categoria', 'ASC']]
            });

            return res.json({
                success: true,
                data: categorias
            });
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar categorias.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/unidades-medida
     * Lista todas as unidades de medida (público)
     */
    async listUnidadesMedida(req, res) {
        try {
            const unidades = await UnidadeMedida.findAll({
                order: [['nome_unidade_medida', 'ASC']]
            });

            return res.json({
                success: true,
                data: unidades
            });
        } catch (error) {
            console.error('Erro ao listar unidades de medida:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar unidades de medida.',
                error: error.message
            });
        }
    }
};

