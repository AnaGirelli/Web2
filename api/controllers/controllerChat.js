import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getChat(req, res) {
        db.Chat.findAll().then(chats => {
            res.status(200).json(chats)
        })
    },
    async postChat(req, res) {
        db.Chat.create(req.body).then((chat)=>{
            res.status(201).json(chat)
        })
    },
    async putChat(req, res) {
        await db.Chat.update(req.body,{where: {id:req.params.id}})
        .then((chat) =>{
            if (chat > 0){
                res.status(200).json(chat)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar o chat'})
            }
        })  
    },
    async deleteChat(req, res) {
        await db.Chat.destroy({where: {id:req.params.id}})
        .then((chat) =>{
            if (chat > 0){
                res.status(200).json(chat)
            }
            else{
                res.status(404).json({'error':'Não pode deletar o chat'})
            }
        })  
    }
}   