import express from 'express';
import pessoaController from '../controllers/pessoaController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/pessoas:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Pessoas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PessoaCreate'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *                   $ref: '#/components/schemas/Pessoa'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: CPF ou e-mail já cadastrado
 */
router.post('/', pessoaController.create);

/**
 * @swagger
 * /api/pessoas/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Pessoas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', pessoaController.login);

/**
 * @swagger
 * /api/pessoas/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Pessoas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pessoa'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/me', authenticateToken, pessoaController.getMe);

/**
 * @swagger
 * /api/pessoas/me:
 *   put:
 *     summary: Atualizar dados do usuário autenticado
 *     tags: [Pessoas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_pessoa:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/me', authenticateToken, pessoaController.updateMe);

/**
 * @swagger
 * /api/pessoas/me/senha:
 *   put:
 *     summary: Atualizar senha do usuário autenticado
 *     tags: [Pessoas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [senhaAtual, novaSenha, confirmarSenha]
 *             properties:
 *               senhaAtual:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *               confirmarSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Senha atual incorreta ou senhas não coincidem
 *       401:
 *         description: Não autenticado
 */
router.put('/me/senha', authenticateToken, pessoaController.updatePassword);

/**
 * @swagger
 * /api/pessoas/me/frete:
 *   put:
 *     summary: Atualizar frete fixo do vendedor
 *     tags: [Pessoas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               frete_fixo:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: Frete atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas vendedores podem configurar frete
 */
router.put('/me/frete', authenticateToken, pessoaController.updateFrete);

export default router;

