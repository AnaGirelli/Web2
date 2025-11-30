import express from 'express';
import avaliacaoController from '../controllers/avaliacaoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.post('/', avaliacaoController.create); // POST /api/avaliacoes
router.get('/venda/:id_venda', avaliacaoController.getByVenda); // GET /api/avaliacoes/venda/:id_venda

export default router;
