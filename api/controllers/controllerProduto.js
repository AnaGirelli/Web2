import { Produto } from '../models/index.js';

export default {
    async getProduto(req, res) {
        try {
            const produto = await Produto.findAll();
            return res.status(200).json(produto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar produtos', details: error });
        }
    },

    async postProduto(req, res) {
        try {
            const novoProduto = await Produto.create(req.body);
            return res.status(201).json(novoProduto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar produto', details: error });
        }
    },

    async putProduto(req, res) {
        try {
            const [updated] = await Produto.update(req.body, {
                where: { id_produto: req.params.id }
            });

            if (updated === 0) {
                return res.status(404).json({ error: 'Produto não encontrado para atualização' });
            }

            const produtoAtualizado = await Produto.findByPk(req.params.id);
            return res.status(200).json(produtoAtualizado);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar produto', details: error });
        }
    },

    async deleteProduto(req, res) {
        try {
            const deletado = await Produto.destroy({
                where: { id_produto: req.params.id }
            });

            if (deletado === 0) {
                return res.status(404).json({ error: 'Produto não encontrado para exclusão' });
            }

            return res.status(200).json({ mensagem: 'Produto deletado com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar produto', details: error });
        }
    }
};
