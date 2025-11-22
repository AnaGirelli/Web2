import { Chat } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // GET /chat (Buscar todos os chats)
    async getChat(req, res) {
        try {
            const chats = await Chat.findAll();
            return res.status(200).json(chats);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar chats', details: error.message });
        }
    },

    // POST /chat (Criar novo chat)
    async postChat(req, res) {
        try {
            const novoChat = await Chat.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novoChat);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar chat', details: error.message });
        }
    },

    // PUT /chat/:id (Atualizar chat específico)
    async putChat(req, res) {
        try {
            // Tenta atualizar usando a chave primária 'id_chat'
            const [updated] = await Chat.update(req.body, {
                where: { id_chat: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Chat não encontrado para atualização' });
            }

            // Busca o registro atualizado para retorná-lo ao cliente
            const chatAtualizado = await Chat.findByPk(req.params.id);
            return res.status(200).json(chatAtualizado); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar chat', details: error.message });
        }
    },

    // DELETE /chat/:id (Deletar chat específico)
    async deleteChat(req, res) {
        try {
            // Deleta o registro usando a chave primária 'id_chat'
            const deletado = await Chat.destroy({
                where: { id_chat: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Chat não encontrado para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Chat deletado com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar chat', details: error.message });
        }
    }
};