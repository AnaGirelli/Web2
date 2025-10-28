const express = require('express');
const database = require('../config/database');
const controllerProduto = require('../controllers/controllerProduto');
const route = express.Router();

//Conecta-se ao banco de dados, deleta todas as tabelas dos modelos e as recria, perdendo todos os dados existentes
/*db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/

module.exports = route;

// Controller Produto
route.get("/produtos", controllerProduto.getProdutos);
route.post("/produtos", controllerProduto.postProduto);
route.put("/produtos/:id", controllerProduto.putProduto);
