import express from 'express';
import produtoController from '../controllers/produtoController.js';
import { authenticateToken, requireVendedor } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas - IMPORTANTE: rotas específicas devem vir antes de rotas com parâmetros
router.get('/categorias/listar', produtoController.listCategorias); // GET /api/produtos/categorias/listar
router.get('/unidades-medida/listar', produtoController.listUnidadesMedida); // GET /api/produtos/unidades-medida/listar
router.get('/', produtoController.list); // GET /api/produtos
router.get('/:id', produtoController.getById); // GET /api/produtos/:id

// Rotas protegidas - Vendedores (rotas específicas antes de rotas com parâmetros)
router.get('/vendedor/meus-produtos', authenticateToken, requireVendedor, produtoController.listMyProducts); // GET /api/produtos/vendedor/meus-produtos
router.post('/', authenticateToken, requireVendedor, produtoController.create); // POST /api/produtos
router.put('/:id', authenticateToken, requireVendedor, produtoController.update); // PUT /api/produtos/:id

export default router;

