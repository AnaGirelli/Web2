import express from 'express';
import vendaController from '../controllers/vendaController.js';
import { authenticateToken, requireVendedor } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/vendas/vendedor/pedidos:
 *   get:
 *     summary: Listar pedidos do vendedor
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos contendo produtos do vendedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venda'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas vendedores podem acessar
 */
router.get('/vendedor/pedidos', requireVendedor, vendaController.listVendedorPedidos);

/**
 * @swagger
 * /api/vendas:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendaCreate'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos ou carrinho vazio
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 */
router.post('/', vendaController.create);

/**
 * @swagger
 * /api/vendas:
 *   get:
 *     summary: Listar pedidos do cliente autenticado
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venda'
 *       401:
 *         description: Não autenticado
 */
router.get('/', vendaController.list);

/**
 * @swagger
 * /api/vendas/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Dados do pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Venda'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para acessar este pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', vendaController.getById);

/**
 * @swagger
 * /api/vendas/{id}:
 *   put:
 *     summary: Atualizar status do pedido
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ABERTA, CONFIRMADA, EM_PREPARO, ENVIADA, FINALIZADA, CANCELADA]
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para atualizar este pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', vendaController.update);

/**
 * @swagger
 * /api/vendas/{id}:
 *   delete:
 *     summary: Excluir pedido (apenas com status ABERTA)
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *       400:
 *         description: Apenas pedidos com status ABERTA podem ser excluídos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para excluir este pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', vendaController.delete);

export default router;

