import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getAvaliacao(req, res) {
        db.Avaliacao.findAll().then(avaliacoes => {
            res.status(200).json(avaliacoes)
        })
    },
    async postAvaliacao(req, res) {
        db.Avaliacao.create(req.body).then((avaliacao)=>{
            res.status(201).json(avaliacao)
        })
    },
    async putAvaliacao(req, res) {
        await db.Avaliacao.update(req.body,{where: {id:req.params.id}})
        .then((avaliacao) =>{
            if (avaliacao > 0){
                res.status(200).json(avaliacao)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar a avaliação'})
            }
        })  
    },
    async deleteAvaliacao(req, res) {
        await db.Avaliacao.destroy({where: {id:req.params.id}})
        .then((avaliacao) =>{
            if (avaliacao > 0){
                res.status(200).json(avaliacao)
            }
            else{
                res.status(404).json({'error':'Não pode deletar a avaliação'})
            }
        })  
    }
}   