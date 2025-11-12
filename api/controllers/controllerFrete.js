import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getFrete(req, res) {
        db.Frete.findAll().then(frete => {
            res.status(200).json(frete)
        })
    },
    async postFrete(req, res) {
        db.Frete.create(req.body).then((frete)=>{
            res.status(201).json(frete)
        })
    },
    async putFrete(req, res) {
        await db.Frete.update(req.body,{where: {id:req.params.id}})
        .then((frete) =>{
            if (frete > 0){
                res.status(200).json(frete)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar o frete'})
            }
        })  
    },
    async deleteFrete(req, res) {
        await db.Frete.destroy({where: {id:req.params.id}})
        .then((frete) =>{
            if (frete > 0){
                res.status(200).json(frete)
            }
            else{
                res.status(404).json({'error':'Não pode deletar o frete'})
            }
        })  
    }
}   