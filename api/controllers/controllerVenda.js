import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getVenda(req, res) {
        db.Venda.findAll().then(venda => {
            res.status(200).json(venda)
        })
    },
    async postVenda(req, res) {
        db.Venda.create(req.body).then((venda)=>{
            res.status(201).json(venda)
        })
    },
    async putVenda(req, res) {
        await db.Venda.update(req.body,{where: {id:req.params.id}})
        .then((venda) =>{
            if (venda > 0){
                res.status(200).json(venda)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar a venda'})
            }
        })  
    },
    async deleteVenda(req, res) {
        await db.Venda.destroy({where: {id:req.params.id}})
        .then((venda) =>{
            if (venda > 0){
                res.status(200).json(venda)
            }
            else{
                res.status(404).json({'error':'Não pode deletar a venda'})
            }
        })  
    }
}   