import { Venda, VendaProduto, Produto, Pessoa, Avaliacao } from '../../mvc/models/index.js';
import { Op } from 'sequelize';

/**
 * Função auxiliar para buscar venda completa com itens e avaliação
 */
async function getVendaCompleta(id_venda, id_vendedor = null) {
    const venda = await Venda.findByPk(id_venda);

    if (!venda) return null;

    // Buscar itens
    const itens = await VendaProduto.findAll({
        where: { id_venda }
    });

    // Filtrar apenas itens do vendedor se especificado
    let itensFiltrados = itens;
    if (id_vendedor) {
        const produtosIds = [];
        for (const item of itens) {
            const produto = await Produto.findByPk(item.id_produto);
            if (produto && produto.id_vendedor === id_vendedor) {
                produtosIds.push(item.id_produto);
            }
        }
        itensFiltrados = itens.filter(item => produtosIds.includes(item.id_produto));
    }

    // Buscar informações dos produtos
    const itensComProdutos = await Promise.all(
        itensFiltrados.map(async (item) => {
            const produto = await Produto.findByPk(item.id_produto);
            return {
                ...item.dataValues,
                produto: produto ? produto.dataValues : null
            };
        })
    );

    // Buscar avaliação
    const avaliacao = await Avaliacao.findOne({
        where: { id_venda }
    });

    // Buscar informações do cliente
    const cliente = await Pessoa.findByPk(venda.id_cliente, {
        attributes: ['id_pessoa', 'nome_pessoa', 'email']
    });

    return {
        ...venda.dataValues,
        itens: itensComProdutos,
        avaliacao: avaliacao ? avaliacao.dataValues : null,
        cliente: cliente ? cliente.dataValues : null
    };
}

/**
 * Controller de Vendas (Pedidos)
 * Implementa CRUD completo seguindo padrão REST
 */
export default {
    /**
     * POST /api/vendas
     * Cria uma nova venda a partir dos itens do carrinho
     */
    async create(req, res) {
        try {
            const { itens, tipo_entrega, forma_pagamento } = req.body;

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Carrinho vazio. Adicione itens antes de finalizar a compra.'
                });
            }

            // Calcular subtotal e validar produtos
            let subtotal = 0;
            const produtosValidos = [];

            for (const item of itens) {
                if (!item.id_produto || !item.quantidade || item.quantidade <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Item inválido. Verifique id_produto e quantidade.'
                    });
                }

                const produto = await Produto.findByPk(item.id_produto);
                
                if (!produto || !produto.ativo) {
                    return res.status(404).json({
                        success: false,
                        message: `Produto ${item.id_produto} não encontrado ou inativo.`
                    });
                }

                subtotal += parseFloat(produto.preco) * item.quantidade;
                produtosValidos.push({
                    id_produto: produto.id_produto,
                    quantidade: item.quantidade,
                    preco_unitario: parseFloat(produto.preco)
                });
            }

            // Calcular frete
            const tipoEntrega = tipo_entrega || 'RETIRADA';
            let custoFrete = 0;

            if (tipoEntrega === 'ENTREGA') {
                // Buscar frete fixo do vendedor (se houver)
                // Por enquanto, usa valor fixo de 15.00
                custoFrete = 15.00;
            }

            const valor_total = subtotal + custoFrete;

            // Criar a venda
            const novaVenda = await Venda.create({
                id_cliente: req.user.id,
                data_venda: new Date(),
                tipo_entrega: tipoEntrega,
                valor_total,
                status: 'ABERTA'
            });

            // Criar os itens da venda
            for (const item of produtosValidos) {
                await VendaProduto.create({
                    id_venda: novaVenda.id_venda,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario
                });
            }

            // Buscar venda completa com itens
            const vendaCompleta = await getVendaCompleta(novaVenda.id_venda);

            return res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso!',
                data: vendaCompleta
            });
        } catch (error) {
            console.error('Erro ao criar venda:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao processar pedido.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/vendas
     * Lista vendas do cliente autenticado
     */
    async list(req, res) {
        try {
            const vendas = await Venda.findAll({
                where: { id_cliente: req.user.id },
                order: [['data_venda', 'DESC']]
            });

            // Buscar itens e avaliações para cada venda
            const vendasCompletas = await Promise.all(
                vendas.map(venda => getVendaCompleta(venda.id_venda))
            );

            return res.json({
                success: true,
                data: vendasCompletas
            });
        } catch (error) {
            console.error('Erro ao listar vendas:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar pedidos.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/vendas/:id
     * Busca uma venda específica
     */
    async getById(req, res) {
        try {
            const { id } = req.params;

            const venda = await Venda.findByPk(id);

            if (!venda) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            // Verificar permissão
            if (venda.id_cliente !== req.user.id && req.user.role !== 'VENDEDOR') {
                return res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para acessar este pedido.'
                });
            }

            // Se for vendedor, verificar se tem produtos nesta venda
            if (req.user.role === 'VENDEDOR' && venda.id_cliente !== req.user.id) {
                const itensVenda = await VendaProduto.findAll({
                    where: { id_venda: id }
                });

                let temProduto = false;
                for (const item of itensVenda) {
                    const produto = await Produto.findByPk(item.id_produto);
                    if (produto && produto.id_vendedor === req.user.id) {
                        temProduto = true;
                        break;
                    }
                }

                if (!temProduto) {
                    return res.status(403).json({
                        success: false,
                        message: 'Você não tem permissão para acessar este pedido.'
                    });
                }
            }

            const vendaCompleta = await getVendaCompleta(id);

            return res.json({
                success: true,
                data: vendaCompleta
            });
        } catch (error) {
            console.error('Erro ao buscar venda:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar pedido.',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/vendas/:id
     * Atualiza uma venda (principalmente status)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const venda = await Venda.findByPk(id);

            if (!venda) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            // Verificar permissão
            let temPermissao = false;

            if (venda.id_cliente === req.user.id) {
                temPermissao = true;
            } else if (req.user.role === 'VENDEDOR') {
                const itensVenda = await VendaProduto.findAll({
                    where: { id_venda: id }
                });

                for (const item of itensVenda) {
                    const produto = await Produto.findByPk(item.id_produto);
                    if (produto && produto.id_vendedor === req.user.id) {
                        temPermissao = true;
                        break;
                    }
                }
            }

            if (!temPermissao) {
                return res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para atualizar este pedido.'
                });
            }

            // Apenas vendedores podem alterar status
            if (status && req.user.role !== 'VENDEDOR' && venda.id_cliente !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Apenas vendedores podem alterar o status do pedido.'
                });
            }

            const updateData = {};
            if (status) updateData.status = status;

            await venda.update(updateData);

            const vendaAtualizada = await getVendaCompleta(id);

            return res.json({
                success: true,
                message: 'Pedido atualizado com sucesso!',
                data: vendaAtualizada
            });
        } catch (error) {
            console.error('Erro ao atualizar venda:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar pedido.',
                error: error.message
            });
        }
    },

    /**
     * DELETE /api/vendas/:id
     * Exclui uma venda (apenas se status ABERTA)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const venda = await Venda.findByPk(id);

            if (!venda) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            // Verificar se status é ABERTA
            if (venda.status !== 'ABERTA') {
                return res.status(400).json({
                    success: false,
                    message: 'Apenas pedidos com status ABERTA podem ser excluídos.'
                });
            }

            // Verificar permissão
            let temPermissao = false;

            if (venda.id_cliente === req.user.id) {
                temPermissao = true;
            } else if (req.user.role === 'VENDEDOR') {
                const itensVenda = await VendaProduto.findAll({
                    where: { id_venda: id }
                });

                for (const item of itensVenda) {
                    const produto = await Produto.findByPk(item.id_produto);
                    if (produto && produto.id_vendedor === req.user.id) {
                        temPermissao = true;
                        break;
                    }
                }
            }

            if (!temPermissao) {
                return res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para excluir este pedido.'
                });
            }

            // Excluir avaliações relacionadas
            await Avaliacao.destroy({
                where: { id_venda: id }
            });

            // Excluir itens da venda
            await VendaProduto.destroy({
                where: { id_venda: id }
            });

            // Excluir a venda
            await Venda.destroy({
                where: { id_venda: id }
            });

            return res.json({
                success: true,
                message: 'Pedido excluído com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao excluir pedido.',
                error: error.message
            });
        }
    },

    /**
     * GET /api/vendas/vendedor/pedidos
     * Lista pedidos onde o vendedor é vendedor dos produtos
     */
    async listVendedorPedidos(req, res) {
        try {
            // Buscar produtos do vendedor
            const produtosVendedor = await Produto.findAll({
                where: { id_vendedor: req.user.id },
                attributes: ['id_produto']
            });

            const idsProdutos = produtosVendedor.map(p => p.id_produto);

            if (idsProdutos.length === 0) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            // Buscar itens de venda que contêm produtos deste vendedor
            const itensVenda = await VendaProduto.findAll({
                where: { id_produto: { [Op.in]: idsProdutos } },
                attributes: ['id_venda'],
                group: ['id_venda']
            });

            const idsVendas = [...new Set(itensVenda.map(item => item.id_venda))];

            if (idsVendas.length === 0) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            // Buscar as vendas
            const vendas = await Venda.findAll({
                where: { id_venda: { [Op.in]: idsVendas } },
                order: [['data_venda', 'DESC']]
            });

            // Montar pedidos completos
            const pedidos = await Promise.all(
                vendas.map(venda => getVendaCompleta(venda.id_venda, req.user.id))
            );

            return res.json({
                success: true,
                data: pedidos
            });
        } catch (error) {
            console.error('Erro ao listar pedidos do vendedor:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar pedidos.',
                error: error.message
            });
        }
    }
};

