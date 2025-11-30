import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes/index.js';

const app = express();

// Configuração CORS para permitir requisições do app mobile
app.use(cors({
    origin: '*', // Em produção precisará especificar os domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Verdear está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rotas da API
app.use('/api', apiRoutes);

// Rota para 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na API:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor.',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
    console.log(`API Verdear rodando na porta ${PORT}`);
});

export default app;

