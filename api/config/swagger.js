import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Verdear',
            version: '1.0.0',
            description: 'Documentação da API REST do sistema Verdear - Plataforma de venda de produtos orgânicos',
            contact: {
                name: 'Equipe Verdear',
                url: 'https://github.com/AnaGirelli/Web2'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido através do endpoint /api/pessoas/login'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Erro ao processar requisição'
                        },
                        error: {
                            type: 'string',
                            example: 'Detalhes do erro'
                        }
                    }
                },
                Pessoa: {
                    type: 'object',
                    properties: {
                        id_pessoa: {
                            type: 'integer',
                            example: 1
                        },
                        nome_pessoa: {
                            type: 'string',
                            example: 'João Silva'
                        },
                        cpf: {
                            type: 'string',
                            example: '12345678901'
                        },
                        email: {
                            type: 'string',
                            example: 'joao@email.com'
                        },
                        tipo_usuario: {
                            type: 'string',
                            enum: ['CLIENTE', 'VENDEDOR'],
                            example: 'CLIENTE'
                        },
                        frete_fixo: {
                            type: 'number',
                            format: 'decimal',
                            example: 15.00
                        }
                    }
                },
                PessoaCreate: {
                    type: 'object',
                    required: ['nome_pessoa', 'cpf', 'email', 'senha', 'tipo_usuario'],
                    properties: {
                        nome_pessoa: {
                            type: 'string',
                            example: 'João Silva'
                        },
                        cpf: {
                            type: 'string',
                            example: '12345678901',
                            description: 'CPF com 11 dígitos numéricos'
                        },
                        email: {
                            type: 'string',
                            example: 'joao@email.com'
                        },
                        senha: {
                            type: 'string',
                            example: 'senha123'
                        },
                        tipo_usuario: {
                            type: 'string',
                            enum: ['CLIENTE', 'VENDEDOR'],
                            example: 'CLIENTE'
                        }
                    }
                },
                Login: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: {
                            type: 'string',
                            example: 'joao@email.com'
                        },
                        senha: {
                            type: 'string',
                            example: 'senha123'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Login realizado com sucesso!'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                },
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'integer',
                                            example: 1
                                        },
                                        nome: {
                                            type: 'string',
                                            example: 'João Silva'
                                        },
                                        email: {
                                            type: 'string',
                                            example: 'joao@email.com'
                                        },
                                        role: {
                                            type: 'string',
                                            example: 'CLIENTE'
                                        },
                                        frete_fixo: {
                                            type: 'number',
                                            example: null
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                Produto: {
                    type: 'object',
                    properties: {
                        id_produto: {
                            type: 'integer',
                            example: 1
                        },
                        nome_produto: {
                            type: 'string',
                            example: 'Tomate Orgânico'
                        },
                        descricao: {
                            type: 'string',
                            example: 'Tomate orgânico fresco'
                        },
                        preco: {
                            type: 'number',
                            format: 'decimal',
                            example: 5.50
                        },
                        estoque: {
                            type: 'number',
                            format: 'decimal',
                            example: 100.000
                        },
                        id_categoria: {
                            type: 'integer',
                            example: 1
                        },
                        id_unidade_medida: {
                            type: 'integer',
                            example: 1
                        },
                        id_vendedor: {
                            type: 'integer',
                            example: 2
                        },
                        url_imagem: {
                            type: 'string',
                            example: 'https://example.com/tomate.jpg'
                        },
                        ativo: {
                            type: 'boolean',
                            example: true
                        }
                    }
                },
                ProdutoCreate: {
                    type: 'object',
                    required: ['nome_produto', 'preco', 'id_unidade_medida'],
                    properties: {
                        nome_produto: {
                            type: 'string',
                            example: 'Tomate Orgânico'
                        },
                        descricao: {
                            type: 'string',
                            example: 'Tomate orgânico fresco'
                        },
                        preco: {
                            type: 'number',
                            format: 'decimal',
                            example: 5.50
                        },
                        estoque: {
                            type: 'number',
                            format: 'decimal',
                            example: 100.000
                        },
                        id_categoria: {
                            type: 'integer',
                            example: 1
                        },
                        id_unidade_medida: {
                            type: 'integer',
                            example: 1
                        },
                        url_imagem: {
                            type: 'string',
                            example: 'https://example.com/tomate.jpg'
                        }
                    }
                },
                Categoria: {
                    type: 'object',
                    properties: {
                        id_categoria: {
                            type: 'integer',
                            example: 1
                        },
                        nome_categoria: {
                            type: 'string',
                            example: 'Verduras'
                        }
                    }
                },
                UnidadeMedida: {
                    type: 'object',
                    properties: {
                        id_unidade_medida: {
                            type: 'integer',
                            example: 1
                        },
                        nome_unidade_medida: {
                            type: 'string',
                            example: 'Kg'
                        }
                    }
                },
                Venda: {
                    type: 'object',
                    properties: {
                        id_venda: {
                            type: 'integer',
                            example: 1
                        },
                        id_cliente: {
                            type: 'integer',
                            example: 1
                        },
                        data_venda: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z'
                        },
                        tipo_entrega: {
                            type: 'string',
                            enum: ['RETIRADA', 'ENTREGA'],
                            example: 'ENTREGA'
                        },
                        valor_total: {
                            type: 'number',
                            format: 'decimal',
                            example: 65.50
                        },
                        status: {
                            type: 'string',
                            enum: ['ABERTA', 'CONFIRMADA', 'EM_PREPARO', 'ENVIADA', 'FINALIZADA', 'CANCELADA'],
                            example: 'ABERTA'
                        },
                        itens: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/VendaProduto'
                            }
                        },
                        avaliacao: {
                            $ref: '#/components/schemas/Avaliacao'
                        },
                        cliente: {
                            type: 'object',
                            properties: {
                                id_pessoa: {
                                    type: 'integer',
                                    example: 1
                                },
                                nome_pessoa: {
                                    type: 'string',
                                    example: 'João Silva'
                                },
                                email: {
                                    type: 'string',
                                    example: 'joao@email.com'
                                }
                            }
                        }
                    }
                },
                VendaCreate: {
                    type: 'object',
                    required: ['itens'],
                    properties: {
                        itens: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id_produto', 'quantidade'],
                                properties: {
                                    id_produto: {
                                        type: 'integer',
                                        example: 1
                                    },
                                    quantidade: {
                                        type: 'number',
                                        example: 2.5
                                    }
                                }
                            }
                        },
                        tipo_entrega: {
                            type: 'string',
                            enum: ['RETIRADA', 'ENTREGA'],
                            example: 'ENTREGA'
                        },
                        forma_pagamento: {
                            type: 'string',
                            example: 'PIX'
                        }
                    }
                },
                VendaProduto: {
                    type: 'object',
                    properties: {
                        id_venda_produto: {
                            type: 'integer',
                            example: 1
                        },
                        id_venda: {
                            type: 'integer',
                            example: 1
                        },
                        id_produto: {
                            type: 'integer',
                            example: 1
                        },
                        quantidade: {
                            type: 'number',
                            example: 2.5
                        },
                        preco_unitario: {
                            type: 'number',
                            format: 'decimal',
                            example: 5.50
                        },
                        produto: {
                            $ref: '#/components/schemas/Produto'
                        }
                    }
                },
                Avaliacao: {
                    type: 'object',
                    properties: {
                        id_avaliacao: {
                            type: 'integer',
                            example: 1
                        },
                        id_venda: {
                            type: 'integer',
                            example: 1
                        },
                        id_cliente: {
                            type: 'integer',
                            example: 1
                        },
                        nota: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            example: 5
                        },
                        comentario: {
                            type: 'string',
                            example: 'Produtos de excelente qualidade!'
                        },
                        data_avaliacao: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-20T14:30:00.000Z'
                        }
                    }
                },
                AvaliacaoCreate: {
                    type: 'object',
                    required: ['id_venda', 'nota'],
                    properties: {
                        id_venda: {
                            type: 'integer',
                            example: 1
                        },
                        nota: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            example: 5
                        },
                        comentario: {
                            type: 'string',
                            example: 'Produtos de excelente qualidade!'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Pessoas',
                description: 'Gerenciamento de usuários (clientes e vendedores)'
            },
            {
                name: 'Produtos',
                description: 'Gerenciamento de produtos'
            },
            {
                name: 'Vendas',
                description: 'Gerenciamento de pedidos/vendas'
            },
            {
                name: 'Avaliações',
                description: 'Gerenciamento de avaliações de pedidos'
            },
            {
                name: 'Health',
                description: 'Verificação de status da API'
            }
        ]
    },
    apis: ['./api/routes/*.js', './api/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
