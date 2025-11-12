import Sequelize from 'sequelize';
import path from 'path';

export default {
    async getVendaProduto(req, res) {
        db.VendaProduto.findAll().then(vendaProduto => {
            res.status(200).json(vendaProduto)
        })
    },
    async postVendaProduto(req, res) {
        db.VendaProduto.create(req.body).then((vendaProduto)=>{
            res.status(201).json(vendaProduto)
        })
    },
    async putVendaProduto(req, res) {
        await db.VendaProduto.update(req.body,{where: {id:req.params.id}})
        .then((vendaProduto) =>{
            if (vendaProduto > 0){
                res.status(200).json(vendaProduto)
            }
            else{
                res.status(404).json({'error':'Não pode atualizar a vendaProduto'})
            }
        })  
    },
    async deleteVendaProduto(req, res) {
        await db.VendaProduto.destroy({where: {id:req.params.id}})
        .then((vendaProduto) =>{
            if (vendaProduto > 0){
                res.status(200).json(vendaProduto)
            }
            else{
                res.status(404).json({'error':'Não pode deletar a vendaProduto'})
            }
        })  
    }
}   