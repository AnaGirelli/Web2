import { Venda } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // GET /venda (Buscar todas as vendas)
    async getVenda(req, res) {
        try {
            const vendas = await Venda.findAll();
            return res.status(200).json(vendas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar vendas', details: error.message });
        }
    },

    // POST /venda (Criar nova venda)
    async postVenda(req, res) {
        try {
            const novaVenda = await Venda.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novaVenda);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar venda', details: error.message });
        }
    },

    // PUT /venda/:id (Atualizar venda específica)
    async putVenda(req, res) {
        try {
            // Tenta atualizar usando a chave primária 'id_venda'
            const [updated] = await Venda.update(req.body, {
                where: { id_venda: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Venda não encontrada para atualização' });
            }

            // Busca o registro atualizado para retorná-lo ao cliente
            const vendaAtualizada = await Venda.findByPk(req.params.id);
            return res.status(200).json(vendaAtualizada); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar venda', details: error.message });
        }
    },

    // DELETE /venda/:id (Deletar venda específica)
    async deleteVenda(req, res) {
        try {
            // Deleta o registro usando a chave primária 'id_venda'
            const deletado = await Venda.destroy({
                where: { id_venda: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Venda não encontrada para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Venda deletada com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar venda', details: error.message });
        }
    }
};