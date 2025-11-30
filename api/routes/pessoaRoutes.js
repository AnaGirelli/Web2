import express from 'express';
import pessoaController from '../controllers/pessoaController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/', pessoaController.create); // POST /api/pessoas - Criar usuário
router.post('/login', pessoaController.login); // POST /api/pessoas/login - Login

// Rotas protegidas
router.get('/me', authenticateToken, pessoaController.getMe); // GET /api/pessoas/me
router.put('/me', authenticateToken, pessoaController.updateMe); // PUT /api/pessoas/me
router.put('/me/senha', authenticateToken, pessoaController.updatePassword); // PUT /api/pessoas/me/senha
router.put('/me/frete', authenticateToken, pessoaController.updateFrete); // PUT /api/pessoas/me/frete

export default router;

