import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getFormaPagamento(req, res) {
        db.FormaPagamento.findAll().then(formapag => {
            res.status(200).json(formapag)
        })
    },
    async postFormaPagamento(req, res) {
        db.FormaPagamento.create(req.body).then((formapag)=>{
            res.status(201).json(formapag)
        })
    },
    async putFormaPagamento(req, res) {
        await db.FormaPagamento.update(req.body,{where: {id:req.params.id}})
        .then((formapag) =>{
            if (formapag > 0){
                res.status(200).json(formapag)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar a forma de pagamento'})
            }
        })  
    },
    async deleteFormaPagamento(req, res) {
        await db.FormaPagamento.destroy({where: {id:req.params.id}})
        .then((formapag) =>{
            if (formapag > 0){
                res.status(200).json(formapag)
            }
            else{
                res.status(404).json({'error':'Não pode deletar a forma de pagamento'})
            }
        })  
    }
}   