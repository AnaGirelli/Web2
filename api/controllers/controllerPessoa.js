import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getPessoa(req, res) {
        db.Pessoa.findAll().then(pessoa => {
            res.status(200).json(pessoa)
        })
    },
    async postPessoa(req, res) {
        db.Pessoa.create(req.body).then((pessoa)=>{
            res.status(201).json(pessoa)
        })
    },
    async putPessoa(req, res) {
        await db.Pessoa.update(req.body,{where: {id:req.params.id}})
        .then((pessoa) =>{
            if (pessoa > 0){
                res.status(200).json(pessoa)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar a pessoa'})
            }
        })  
    },
    async deletePessoa(req, res) {
        await db.Pessoa.destroy({where: {id:req.params.id}})
        .then((pessoa) =>{
            if (pessoa > 0){
                res.status(200).json(pessoa)
            }
            else{
                res.status(404).json({'error':'Não pode deletar a pessoa'})
            }
        })  
    }
}   