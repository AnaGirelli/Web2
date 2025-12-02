import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import apiRoutes from './routes/index.js';

const app = express();

// Configuração CORS para permitir requisições do app mobile e Swagger UI
app.use(cors({
    origin: '*', // Em produção precisará especificar os domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Verdear - Documentação'
}));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica o status da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'API Verdear está funcionando!'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
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

