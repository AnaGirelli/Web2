import express from 'express';
import pessoaRoutes from './pessoaRoutes.js';
import produtoRoutes from './produtoRoutes.js';
import vendaRoutes from './vendaRoutes.js';
import avaliacaoRoutes from './avaliacaoRoutes.js';

const router = express.Router();

// Rotas da API
router.use('/pessoas', pessoaRoutes);
router.use('/produtos', produtoRoutes);
router.use('/vendas', vendaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);

export default router;

