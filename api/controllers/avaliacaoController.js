import { Avaliacao, Venda } from '../../mvc/models/index.js';

export default {
    /*
    POST /api/avaliacoes
    Cria uma nova avaliação para um pedido
    */
    async create(req, res) {
        try {
            const { id_venda, nota, comentario } = req.body;

            if (!id_venda || !nota) {
                return res.status(400).json({
                    success: false,
                    message: 'id_venda e nota são obrigatórios.'
                });
            }

            // Validar nota (deve ser entre 1 e 5)
            if (nota < 1 || nota > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'A nota deve ser entre 1 e 5.'
                });
            }

            // Verificar se a venda existe e pertence ao cliente
            const venda = await Venda.findByPk(id_venda);

            if (!venda) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            if (venda.id_cliente !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Você só pode avaliar seus próprios pedidos.'
                });
            }

            // Verificar se o pedido está finalizado
            if (venda.status !== 'FINALIZADA') {
                return res.status(400).json({
                    success: false,
                    message: 'Apenas pedidos finalizados podem ser avaliados.'
                });
            }

            // Função para verificar se já existe avaliação para este pedido
            const avaliacaoExistente = await Avaliacao.findOne({
                where: {
                    id_venda: id_venda,
                    id_cliente: req.user.id
                }
            });

            if (avaliacaoExistente) {
                return res.status(409).json({
                    success: false,
                    message: 'Este pedido já foi avaliado.'
                });
            }

            // Criar avaliação
            const novaAvaliacao = await Avaliacao.create({
                id_venda,
                id_cliente: req.user.id,
                nota,
                comentario: comentario || null,
                data_avaliacao: new Date()
            });

            return res.status(201).json({
                success: true,
                message: 'Avaliação registrada com sucesso!',
                data: novaAvaliacao
            });
        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao registrar avaliação.',
                error: error.message
            });
        }
    },

    /*
    GET /api/avaliacoes/venda/:id_venda
    Busca avaliação de uma venda específica
    */
    async getByVenda(req, res) {
        try {
            const { id_venda } = req.params;

            const avaliacao = await Avaliacao.findOne({
                where: { id_venda }
            });

            if (!avaliacao) {
                return res.status(404).json({
                    success: false,
                    message: 'Avaliação não encontrada para este pedido.'
                });
            }

            return res.json({
                success: true,
                data: avaliacao
            });
        } catch (error) {
            console.error('Erro ao buscar avaliação:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar avaliação.',
                error: error.message
            });
        }
    }
};

