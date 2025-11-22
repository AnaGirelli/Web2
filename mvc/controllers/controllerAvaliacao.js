import { Avaliacao } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // GET /avaliacao (Buscar todas as avaliações)
    async getAvaliacao(req, res) {
        try {
            const avaliacoes = await Avaliacao.findAll();
            return res.status(200).json(avaliacoes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar avaliações', details: error.message });
        }
    },

    // POST /avaliacao (Criar nova avaliação)
    async postAvaliacao(req, res) {
        try {
            const novaAvaliacao = await Avaliacao.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novaAvaliacao);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar avaliação', details: error.message });
        }
    },

    // PUT /avaliacao/:id (Atualizar avaliação específica)
    async putAvaliacao(req, res) {
        try {
            // Tenta atualizar usando a chave primária 'id_avaliacao'
            const [updated] = await Avaliacao.update(req.body, {
                where: { id_avaliacao: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Avaliação não encontrada para atualização' });
            }

            // Busca o registro atualizado para retorná-lo ao cliente
            const avaliacaoAtualizada = await Avaliacao.findByPk(req.params.id);
            return res.status(200).json(avaliacaoAtualizada); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar avaliação', details: error.message });
        }
    },

    // DELETE /avaliacao/:id (Deletar avaliação específica)
    async deleteAvaliacao(req, res) {
        try {
            // Deleta o registro usando a chave primária 'id_avaliacao'
            const deletado = await Avaliacao.destroy({
                where: { id_avaliacao: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Avaliação não encontrada para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Avaliação deletada com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar avaliação', details: error.message });
        }
    }
};