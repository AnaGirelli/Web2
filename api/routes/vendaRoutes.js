import express from 'express';
import vendaController from '../controllers/vendaController.js';
import { authenticateToken, requireVendedor } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de cliente
router.post('/', vendaController.create); // POST /api/vendas - Criar pedido
router.get('/', vendaController.list); // GET /api/vendas - Listar pedidos do cliente
router.get('/:id', vendaController.getById); // GET /api/vendas/:id - Buscar pedido específico
router.put('/:id', vendaController.update); // PUT /api/vendas/:id - Atualizar pedido
router.delete('/:id', vendaController.delete); // DELETE /api/vendas/:id - Excluir pedido

// Rotas de vendedor
router.get('/vendedor/pedidos', requireVendedor, vendaController.listVendedorPedidos); // GET /api/vendas/vendedor/pedidos

export default router;

