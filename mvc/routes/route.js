import express from 'express';
import database from '../config/database.js';
import controllerAvaliacao from '../controllers/controllerAvaliacao.js';
import controllerChat from '../controllers/controllerChat.js';
import controllerFormaPagamento from '../controllers/controllerFormaPagamento.js';
import controllerFrete from '../controllers/controllerFrete.js';
import controllerPessoa from '../controllers/controllerPessoa.js';
import controllerProduto from '../controllers/controllerProduto.js';
import controllerVenda from '../controllers/controllerVenda.js';
import controllerVendaProduto from '../controllers/controllerVendaProduto.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const route = express.Router();

//Conecta-se ao banco de dados, deleta todas as tabelas dos modelos e as recria, perdendo todos os dados existentes
// database.sequelize.sync({force: true}).then(() => {
//     console.log('{ force: true }');
// });

// Rota para exibir a página de login (GET /)
route.get("/", function(req, res) {
    // Adiciona o redirecionamento se o usuário já estiver logado
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/home'); // Redireciona para a home
    }
    // Renderiza a view 'login'
    res.render('login', {error: null});
});
// Rota para processar o login (POST /login)
route.post("/login", controllerPessoa.authenticate);

// Rota para a home (Protegida)
route.get("/home", isAuthenticated, (req, res) => {
    res.render('home'); // Renderiza a tela home.ejs
});

// Controller Pessoa
route.post("/pessoa", controllerPessoa.postPessoa);
route.put("/pessoa/:id", controllerPessoa.putPessoa);

// Controller Avaliacao
route.get("/avaliacao", controllerAvaliacao.getAvaliacao);
route.post("/avaliacao", controllerAvaliacao.postAvaliacao);
route.put("/avaliacao/:id", controllerAvaliacao.putAvaliacao);

// Controller Chat
route.get("/chat", controllerChat.getChat);
route.post("/chat", controllerChat.postChat);
route.put("/chat/:id", controllerChat.putChat);

// Controller Forma Pagamento
route.get("/formapagamento", controllerFormaPagamento.getFormaPagamento);
route.post("/formapagamento", controllerFormaPagamento.postFormaPagamento);
route.put("/formapagamento/:id", controllerFormaPagamento.putFormaPagamento);

// Controller Frete
route.get("/frete", controllerFrete.getFrete);
route.post("/frete", controllerFrete.postFrete);
route.put("/frete/:id", controllerFrete.putFrete);

// Controller Produto
route.get("/produto", controllerProduto.getProduto);
route.post("/produto", controllerProduto.postProduto);
route.put("/produto/:id", controllerProduto.putProduto);

// Controller Venda
route.get("/venda", controllerVenda.getVenda);
route.post("/venda", controllerVenda.postVenda);
route.put("/venda/:id", controllerVenda.putVenda);

// Controller Venda Produto
route.get("/vendaproduto", controllerVendaProduto.getVendaProduto);
route.post("/vendaproduto", controllerVendaProduto.postVendaProduto);
route.put("/vendaproduto/:id", controllerVendaProduto.putVendaProduto);

export default route;