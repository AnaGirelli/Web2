import { Produto, Categoria, UnidadeMedida } from '../models/index.js';

export default {

    // ================================
    // BUSCAR PRODUTOS DO VENDEDOR (para a VIEW)
    // ================================
    async fetchProdutosVendedor(id_vendedor) {
        try {
            return await Produto.findAll({
                where: { id_vendedor },
                order: [['id_produto', 'DESC']]
            });
        } catch (error) {
            console.error("Erro ao carregar catálogo:", error);
            return [];
        }
    },

    // ================================
    // BUSCAR CATEGORIAS (para o select)
    // ================================
    async fetchCategorias() {
        try {
            return await Categoria.findAll();
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            return [];
        }
    },

    // ================================
    // BUSCAR UNIDADES DE MEDIDA (para select)
    // ================================
    async fetchUnidades() {
        try {
            return await UnidadeMedida.findAll({
                order: [['nome_unidade_medida', 'ASC']]
            });
        } catch (error) {
            console.error("Erro ao buscar unidades:", error);
            return [];
        }
    },

    // ================================
    // GET /vendedor/produtos
    // ================================
    async getProdutosVendedor(req, res) {
        const id_vendedor = req.session.userId;

        if (!req.session.isAuthenticated || req.session.userRole !== 'VENDEDOR') {
            return res.status(401).json({ success: false, message: "Não autorizado." });
        }

        try {
            const produtos = await Produto.findAll({
                where: { id_vendedor },
                order: [['id_produto', 'DESC']]
            });

            return res.json({ success: true, produtos });

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            return res.status(500).json({ success: false, message: "Erro interno." });
        }
    },

    // ================================
    // POST /vendedor/produtos
    // ================================
    async postProduto(req, res) {
        const id_vendedor = req.session.userId;

        if (!req.session.isAuthenticated || req.session.userRole !== 'VENDEDOR') {
            return res.status(401).json({ success: false, message: "Não autorizado." });
        }

        try {
            const { nome_produto, descricao, preco, estoque, id_categoria, id_unidade_medida, url_imagem } = req.body;

            // -------------------------
            //  VALIDAÇÕES
            // -------------------------

            if (!nome_produto || !preco || !id_unidade_medida) {
                return res.status(400).json({
                    success: false,
                    message: "Preencha todos os campos obrigatórios."
                });
            }

            if (estoque < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Estoque não pode ser negativo."
                });
            }

            const novoProduto = await Produto.create({
                nome_produto,
                descricao,
                preco,
                estoque: estoque || 0,
                id_categoria: id_categoria || null,
                id_unidade_medida,
                url_imagem: url_imagem || null,
                id_vendedor,
                ativo: true
            });

            return res.status(201).json({
                success: true,
                message: "Produto cadastrado com sucesso!",
                produto: novoProduto
            });

        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao cadastrar produto."
            });
        }
    },
    // ================================
    // PUT /api/vendedor/produtos/:id
    // ================================
    async putProduto(req, res) {
        const id_vendedor = req.session.userId;
        const { id } = req.params;

        if (!req.session.isAuthenticated || req.session.userRole !== 'VENDEDOR') {
            return res.status(401).json({ success: false, message: "Não autorizado." });
        }

        try {
            const produto = await Produto.findOne({
                where: { id_produto: id, id_vendedor }
            });

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: "Produto não encontrado."
                });
            }

            const { nome_produto, descricao, preco, estoque, id_categoria, id_unidade_medida, url_imagem } = req.body;

            if (!nome_produto || !preco || !id_unidade_medida) {
                return res.status(400).json({
                    success: false,
                    message: "Preencha todos os campos obrigatórios."
                });
            }

            if (estoque < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Estoque não pode ser negativo."
                });
            }

            await produto.update({
                nome_produto,
                descricao,
                preco,
                estoque,
                id_categoria,
                id_unidade_medida,
                url_imagem
            });

            return res.json({
                success: true,
                message: "Produto atualizado com sucesso!",
                produto
            });

        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao atualizar produto."
            });
        }
    }
};
