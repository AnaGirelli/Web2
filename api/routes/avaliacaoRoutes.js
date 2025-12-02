import express from 'express';
import avaliacaoController from '../controllers/avaliacaoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Criar avaliação de pedido
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvaliacaoCreate'
 *     responses:
 *       201:
 *         description: Avaliação registrada com sucesso
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
 *                   $ref: '#/components/schemas/Avaliacao'
 *       400:
 *         description: Dados inválidos ou pedido não pode ser avaliado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Você só pode avaliar seus próprios pedidos
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido já foi avaliado
 */
router.post('/', avaliacaoController.create);

/**
 * @swagger
 * /api/avaliacoes/venda/{id_venda}:
 *   get:
 *     summary: Buscar avaliação de um pedido
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_venda
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Dados da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Avaliacao'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Avaliação não encontrada para este pedido
 */
router.get('/venda/:id_venda', avaliacaoController.getByVenda);

export default router;
