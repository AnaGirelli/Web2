import sequelize from './api/config/database.js';
import express from 'express';
import route from './api/routes/route.js'; 


//instanciar o aplicativo express
const app = express();
const port = 3000;

// Middlewares
app.use(express.json()); //interpreta JSON no corpo das requisições
app.use('/', route); //Usa as rotas da API (as definidas em api/routes/route.js)

//Testar a conexão com o banco de dados
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco bem-sucedida');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
  }
})();

app.get('/', (req, res) => {
    res.send('API em execução com sucesso!');
});

app.listen(port, () => {
    console.log(`Servidor em execução no endereço http://localhost:${port}`);
});
