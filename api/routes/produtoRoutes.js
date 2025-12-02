import express from 'express';
import produtoController from '../controllers/produtoController.js';
import { authenticateToken, requireVendedor } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/produtos/categorias/listar:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de categorias
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
 *                     $ref: '#/components/schemas/Categoria'
 */
router.get('/categorias/listar', produtoController.listCategorias);

/**
 * @swagger
 * /api/produtos/unidades-medida/listar:
 *   get:
 *     summary: Listar todas as unidades de medida
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de unidades de medida
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
 *                     $ref: '#/components/schemas/UnidadeMedida'
 */
router.get('/unidades-medida/listar', produtoController.listUnidadesMedida);

/**
 * @swagger
 * /api/produtos/vendedor/meus-produtos:
 *   get:
 *     summary: Listar produtos do vendedor autenticado
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos do vendedor
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
 *                     $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas vendedores podem acessar
 */
router.get('/vendedor/meus-produtos', authenticateToken, requireVendedor, produtoController.listMyProducts);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Listar produtos ativos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da categoria
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Buscar por nome ou descrição
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                     $ref: '#/components/schemas/Produto'
 */
router.get('/', produtoController.list);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', produtoController.getById);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoCreate'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
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
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas vendedores podem criar produtos
 */
router.post('/', authenticateToken, requireVendedor, produtoController.create);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_produto:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               estoque:
 *                 type: number
 *               id_categoria:
 *                 type: integer
 *               id_unidade_medida:
 *                 type: integer
 *               url_imagem:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas o vendedor dono pode atualizar
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', authenticateToken, requireVendedor, produtoController.update);

export default router;

