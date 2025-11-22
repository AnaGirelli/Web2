import { FormaPagamento } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // GET /formapagamento (Buscar todas as formas de pagamento)
    async getFormaPagamento(req, res) {
        try {
            const formasPagamento = await FormaPagamento.findAll();
            return res.status(200).json(formasPagamento);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar formas de pagamento', details: error.message });
        }
    },

    // POST /formapagamento (Criar nova forma de pagamento)
    async postFormaPagamento(req, res) {
        try {
            const novaFormaPagamento = await FormaPagamento.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novaFormaPagamento);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar forma de pagamento', details: error.message });
        }
    },

    // PUT /formapagamento/:id (Atualizar forma de pagamento específica)
    async putFormaPagamento(req, res) {
        try {
            // Tenta atualizar usando a chave primária 'id_forma_pagamento'
            const [updated] = await FormaPagamento.update(req.body, {
                where: { id_forma_pagamento: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Forma de pagamento não encontrada para atualização' });
            }

            // Busca o registro atualizado para retorná-lo ao cliente
            const formaPagamentoAtualizada = await FormaPagamento.findByPk(req.params.id);
            return res.status(200).json(formaPagamentoAtualizada); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar forma de pagamento', details: error.message });
        }
    },

    // DELETE /formapagamento/:id (Deletar forma de pagamento específica)
    async deleteFormaPagamento(req, res) {
        try {
            // Deleta o registro usando a chave primária 'id_forma_pagamento'
            const deletado = await FormaPagamento.destroy({
                where: { id_forma_pagamento: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Forma de pagamento não encontrada para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Forma de pagamento deletada com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar forma de pagamento', details: error.message });
        }
    }
};