import { Frete } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // GET /frete (Buscar todos os fretes)
    async getFrete(req, res) {
        try {
            const fretes = await Frete.findAll();
            return res.status(200).json(fretes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar fretes', details: error.message });
        }
    },

    // POST /frete (Criar novo frete)
    async postFrete(req, res) {
        try {
            const novoFrete = await Frete.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novoFrete);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar frete', details: error.message });
        }
    },

    // PUT /frete/:id (Atualizar frete específico)
    async putFrete(req, res) {
        try {
            // Tenta atualizar usando a chave primária 'id_frete'
            const [updated] = await Frete.update(req.body, {
                where: { id_frete: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Frete não encontrado para atualização' });
            }

            // Busca o registro atualizado para retorná-lo ao cliente
            const freteAtualizado = await Frete.findByPk(req.params.id);
            return res.status(200).json(freteAtualizado); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar frete', details: error.message });
        }
    },

    // DELETE /frete/:id (Deletar frete específico)
    async deleteFrete(req, res) {
        try {
            // Deleta o registro usando a chave primária 'id_frete'
            const deletado = await Frete.destroy({
                where: { id_frete: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Frete não encontrado para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Frete deletado com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar frete', details: error.message });
        }
    }
};