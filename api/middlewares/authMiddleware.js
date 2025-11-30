import jwt from 'jsonwebtoken';
import { Pessoa } from '../../mvc/models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'verdear_secret_key_2024';

/*
Middleware de autenticação JWT
Verifica se o token é válido e adiciona informações do usuário ao request
*/
export const authenticateToken = async (req, res, next) => {
    try {
        // Busca o token no header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticação não fornecido'
            });
        }

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Busca o usuário no banco para garantir que ainda existe
        const pessoa = await Pessoa.findByPk(decoded.userId);
        
        if (!pessoa) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Adiciona informações do usuário ao request
        req.user = {
            id: pessoa.id_pessoa,
            email: pessoa.email,
            nome: pessoa.nome_pessoa,
            role: pessoa.tipo_usuario
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar autenticação',
            error: error.message
        });
    }
};

/**
 * Middleware para verificar se o usuário é VENDEDOR
 */
export const requireVendedor = (req, res, next) => {
    if (req.user.role !== 'VENDEDOR') {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Apenas vendedores podem acessar este recurso.'
        });
    }
    next();
};

/**
 * Middleware para verificar se o usuário é CLIENTE
 */
export const requireCliente = (req, res, next) => {
    if (req.user.role !== 'CLIENTE') {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Apenas clientes podem acessar este recurso.'
        });
    }
    next();
};

/**
 * Gera um token JWT para o usuário
 */
export const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET
        // Token sem expiração
    );
};

