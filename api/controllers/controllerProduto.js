const db = require('../config/database');
const path = require('path');

module.exports = {
    async getProdutos(req, res) {
        db.Produto.findAll().then(produtos => {
            res.status(200).json(produtos)
        })
    },
    async postProduto(req, res) {
        db.Produto.create(req.body).then((produto)=>{
            res.status(201).json(produto)
        })
    },
    async putProduto(req, res) {
        await db.Produto.update(req.body,{where: {id:req.params.id}})
        .then((produto) =>{
            if (produto > 0){
                res.status(200).json(produto)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar o produto'})
            }
        })  
    },
    async deleteProduto(req, res) {
        await db.Produto.destroy({where: {id:req.params.id}})
        .then((produto) =>{
            if (produto > 0){
                res.status(200).json(produto)
            }
            else{
                res.status(404).json({'error':'Não pode deletar o produto'})
            }
        })  
    }
}   