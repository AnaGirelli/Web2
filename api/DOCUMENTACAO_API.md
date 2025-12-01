# API Verdear - Documentação Completa

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Pessoas (Usuários)](#pessoas-usuários)
  - [Produtos](#produtos)
  - [Vendas (Pedidos)](#vendas-pedidos)
  - [Avaliações](#avaliações)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Estrutura de Respostas](#estrutura-de-respostas)
- [Regras de Negócio](#regras-de-negócio)
- [Exemplos de Uso](#exemplos-de-uso)

---

## Visão Geral

A **API Verdear** é uma API REST que fornece acesso a todas as funcionalidades do sistema através de tokens JWT. A API segue 100% o padrão REST e implementa todos os CRUDs da parte 1 do projeto, além das regras de negócio adicionais.

### Tecnologias

- **Node.js** com Express.js
- **PostgreSQL** com Sequelize ORM
- **JWT** (JSON Web Tokens) para autenticação

---

## Base URL

```
http://localhost:3001/
```

---

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Todas as rotas protegidas requerem um token válido no header `Authorization`.

### Como obter um token

1. Faça login através do endpoint `POST /api/pessoas/login` (modelo com exemplos em Endpoints -> Pessoas)
2. O token será retornado no campo `data.token`
3. Use o token em todas as requisições subsequentes

### Como usar o token

Inclua o token no header `Authorization` de todas as requisições protegidas:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

### Validade do token

- Os tokens **não expiram**
- Uma vez obtido, o token permanece válido até que seja invalidado manualmente

---

## Endpoints

### Pessoas (Usuários)

#### POST /api/pessoas
Cria um novo usuário (público)

**Request Body:**
```json
{
  "nome_pessoa": "João Silva",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo_usuario": "CLIENTE"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso!",
  "data": {
    "id": 1,
    "nome_pessoa": "João Silva",
    "email": "joao@email.com",
    "tipo_usuario": "CLIENTE",
    "frete_fixo": null
  }
}
```

---

#### POST /api/pessoas/login
Autentica um usuário e retorna token JWT (público)

**Request Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "role": "CLIENTE",
      "frete_fixo": null
    }
  }
}
```

---

#### GET /api/pessoas/me
Retorna dados do usuário autenticado (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_pessoa": 1,
    "nome_pessoa": "João Silva",
    "email": "joao@email.com",
    "tipo_usuario": "CLIENTE",
    "frete_fixo": null
  }
}
```

---

#### PUT /api/pessoas/me
Atualiza dados do usuário autenticado (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "nome_pessoa": "João Silva Santos",
  "email": "joao.santos@email.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dados atualizados com sucesso!",
  "data": {
    "id_pessoa": 1,
    "nome_pessoa": "João Silva Santos",
    "email": "joao.santos@email.com",
    "tipo_usuario": "CLIENTE",
    "frete_fixo": null
  }
}
```

---

#### PUT /api/pessoas/me/senha
Atualiza senha do usuário autenticado (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "senhaAtual": "suaSenha",
  "novaSenha": "novaSenha",
  "confirmarSenha": "novaSenha"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso!"
}
```

---

#### PUT /api/pessoas/me/frete
Atualiza frete fixo do vendedor (protegido - apenas vendedores)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "frete_fixo": 10.50
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Frete atualizado com sucesso!",
  "data": {
    "id_pessoa": 2,
    "nome_pessoa": "Maria Vendedora",
    "email": "maria@email.com",
    "tipo_usuario": "VENDEDOR",
    "frete_fixo": 10.50
  }
}
```

---

### Produtos

#### GET /api/produtos
Lista todos os produtos ativos (público)

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoria
- `busca` (opcional): Buscar por nome ou descrição

**Exemplo:**
```
GET /api/produtos?categoria=1&busca=tomate
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_produto": 1,
      "nome_produto": "Tomate Orgânico",
      "descricao": "Tomate fresco e orgânico",
      "preco": 8.50,
      "estoque": 100,
      "id_categoria": 1,
      "id_unidade_medida": 1,
      "url_imagem": "https://...",
      "id_vendedor": 2,
      "ativo": true
    }
  ]
}
```

---

#### GET /api/produtos/:id
Busca um produto específico por ID (público)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_produto": 1,
    "nome_produto": "Tomate Orgânico",
    "descricao": "Tomate fresco e orgânico",
    "preco": 8.50,
    "estoque": 100,
    "id_categoria": 1,
    "id_unidade_medida": 1,
    "url_imagem": "https://...",
    "id_vendedor": 2,
    "ativo": true
  }
}
```

---

#### GET /api/produtos/vendedor/meus-produtos
Lista produtos do vendedor autenticado (protegido - apenas vendedores)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_produto": 1,
      "nome_produto": "Tomate Orgânico",
      "preco": 8.50,
      "estoque": 100,
      "ativo": true
    }
  ]
}
```

---

#### POST /api/produtos
Cria um novo produto (protegido - apenas vendedores)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "nome_produto": "Tomate Orgânico",
  "descricao": "Tomate fresco e orgânico",
  "preco": 8.50,
  "estoque": 100,
  "id_categoria": 1,
  "id_unidade_medida": 1,
  "url_imagem": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso!",
  "data": {
    "id_produto": 1,
    "nome_produto": "Tomate Orgânico",
    "preco": 8.50,
    "estoque": 100,
    "ativo": true
  }
}
```

---

#### PUT /api/produtos/:id
Atualiza um produto (protegido - apenas o vendedor dono)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body (campos opcionais):**
```json
{
  "nome_produto": "Tomate Orgânico Premium",
  "preco": 9.50,
  "estoque": 150,
  "ativo": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso!",
  "data": {
    "id_produto": 1,
    "nome_produto": "Tomate Orgânico Premium",
    "preco": 9.50,
    "estoque": 150,
    "ativo": true
  }
}
```

---

#### GET /api/produtos/categorias/listar
Lista todas as categorias (público)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_categoria": 1,
      "nome_categoria": "Hortifrúti"
    }
  ]
}
```

---

#### GET /api/produtos/unidades-medida/listar
Lista todas as unidades de medida (público)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_unidade_medida": 1,
      "nome_unidade_medida": "KG"
    }
  ]
}
```

---

### Vendas (Pedidos)

#### POST /api/vendas
Cria uma nova venda (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "itens": [
    {
      "id_produto": 1,
      "quantidade": 2
    },
    {
      "id_produto": 3,
      "quantidade": 1
    }
  ],
  "tipo_entrega": "ENTREGA",
  "forma_pagamento": "CARTÃO"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso!",
  "data": {
    "id_venda": 1,
    "id_cliente": 1,
    "data_venda": "2024-01-15T10:30:00.000Z",
    "tipo_entrega": "ENTREGA",
    "valor_total": 26.50,
    "status": "ABERTA",
    "itens": [
      {
        "id_venda_produto": 1,
        "id_venda": 1,
        "id_produto": 1,
        "quantidade": 2,
        "preco_unitario": 8.50,
        "produto": {
          "id_produto": 1,
          "nome_produto": "Tomate Orgânico"
        }
      }
    ],
    "avaliacao": null,
    "cliente": {
      "id_pessoa": 1,
      "nome_pessoa": "João Silva",
      "email": "joao@email.com"
    }
  }
}
```

---

#### GET /api/vendas
Lista vendas do cliente autenticado (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_venda": 1,
      "id_cliente": 1,
      "data_venda": "2024-01-15T10:30:00.000Z",
      "tipo_entrega": "ENTREGA",
      "valor_total": 26.50,
      "status": "ABERTA",
      "itens": [...],
      "avaliacao": null
    }
  ]
}
```

---

#### GET /api/vendas/:id
Busca uma venda específica (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_venda": 1,
    "id_cliente": 1,
    "data_venda": "2024-01-15T10:30:00.000Z",
    "tipo_entrega": "ENTREGA",
    "valor_total": 26.50,
    "status": "ABERTA",
    "itens": [...],
    "avaliacao": null,
    "cliente": {...}
  }
}
```

---

#### PUT /api/vendas/:id
Atualiza uma venda (principalmente status) (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "status": "FINALIZADA"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pedido atualizado com sucesso!",
  "data": {
    "id_venda": 1,
    "status": "FINALIZADA",
    ...
  }
}
```

---

#### DELETE /api/vendas/:id
Exclui uma venda (apenas se status ABERTA) (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pedido excluído com sucesso!"
}
```

---

#### GET /api/vendas/vendedor/pedidos
Lista pedidos onde o vendedor é vendedor dos produtos (protegido - apenas vendedores)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_venda": 1,
      "id_cliente": 1,
      "status": "ABERTA",
      "itens": [
        {
          "id_produto": 1,
          "quantidade": 2,
          "produto": {
            "id_produto": 1,
            "nome_produto": "Tomate Orgânico"
          }
        }
      ],
      "cliente": {
        "nome": "João Silva",
        "email": "joao@email.com"
      }
    }
  ]
}
```

---

### Avaliações

#### POST /api/avaliacoes
Cria uma nova avaliação para um pedido (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "id_venda": 1,
  "nota": 5,
  "comentario": "Produtos de excelente qualidade!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Avaliação registrada com sucesso!",
  "data": {
    "id_avaliacao": 1,
    "id_venda": 1,
    "id_cliente": 1,
    "nota": 5,
    "comentario": "Produtos de excelente qualidade!",
    "data_avaliacao": "2024-01-16T10:30:00.000Z"
  }
}
```

---

#### GET /api/avaliacoes/venda/:id_venda
Busca avaliação de uma venda específica (protegido)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_avaliacao": 1,
    "id_venda": 1,
    "id_cliente": 1,
    "nota": 5,
    "comentario": "Produtos de excelente qualidade!",
    "data_avaliacao": "2024-01-16T10:30:00.000Z"
  }
}
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso - Requisição processada com sucesso |
| 201 | Criado - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos na requisição |
| 401 | Unauthorized - Token não fornecido ou inválido |
| 403 | Forbidden - Acesso negado (sem permissão) |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: email já cadastrado) |
| 500 | Internal Server Error - Erro interno do servidor |

---

## Estrutura de Respostas

### Resposta de Sucesso

```json
{
  "success": true,
  "message": "Mensagem de sucesso (opcional)",
  "data": { ... }
}
```

### Resposta de Erro

```json
{
  "success": false,
  "message": "Mensagem de erro"
}
```

---

## Regras de Negócio

### Autenticação e Autorização

1. **Tokens JWT**: Todas as rotas protegidas requerem token válido
2. **Validade**: Tokens não expiram
3. **Perfis**: CLIENTE e VENDEDOR com permissões diferentes

### Pessoas (Usuários)

1. **CPF único**: Cada CPF pode ser cadastrado apenas uma vez
2. **Email único**: Cada email pode ser cadastrado apenas uma vez
3. **CPF**: Deve conter exatamente 11 dígitos numéricos
4. **Frete fixo**: Apenas vendedores podem configurar

### Produtos

1. **Criação**: Apenas vendedores podem criar produtos
2. **Edição**: Apenas o vendedor dono pode editar
3. **Estoque**: Não pode ser negativo
4. **Campos obrigatórios**: nome_produto, preco, id_unidade_medida

### Vendas (Pedidos)

1. **Criação**: Clientes criam pedidos a partir de itens do carrinho
2. **Status inicial**: Todos os pedidos são criados com status "ABERTA"
3. **Exclusão**: Apenas pedidos com status "ABERTA" podem ser excluídos
4. **Permissões de exclusão**:
   - Cliente pode excluir seus próprios pedidos "ABERTA"
   - Vendedor pode excluir pedidos onde é vendedor dos produtos
5. **Atualização de status**: Apenas vendedores podem alterar status
6. **Status possíveis**: ABERTA, FINALIZADA, CANCELADA

### Avaliações

1. **Criação**: Apenas clientes podem avaliar
2. **Pedido próprio**: Cliente só pode avaliar seus próprios pedidos
3. **Status**: Apenas pedidos com status "FINALIZADA" podem ser avaliados
4. **Nota**: Deve ser entre 1 e 5
5. **Única avaliação**: Cada pedido pode ter apenas uma avaliação
6. **Sem edição**: Avaliações não podem ser editadas ou excluídas

### Carrinho (Mobile)

1. **Gerenciamento local**: O carrinho é gerenciado no app mobile
2. **Validação na API**: Ao finalizar compra, a API valida todos os itens
3. **Produtos ativos**: Apenas produtos ativos podem ser adicionados
4. **Quantidade**: Deve ser maior que 0

---

## Exemplos de Uso

### Fluxo Completo de Compra

1. **Cadastrar usuário**
```bash
POST /api/pessoas
```

2. **Fazer login**
```bash
POST /api/pessoas/login
# Salvar o token retornado
```

3. **Listar produtos**
```bash
GET /api/produtos
```

4. **Adicionar produtos ao carrinho** (no app mobile)

5. **Criar pedido**
```bash
POST /api/vendas
Authorization: Bearer TOKEN
{
  "itens": [
    {"id_produto": 1, "quantidade": 2},
    {"id_produto": 3, "quantidade": 1}
  ],
  "tipo_entrega": "ENTREGA"
}
```

6. **Vendedor atualiza status**
```bash
PUT /api/vendas/1
Authorization: Bearer TOKEN_VENDEDOR
{
  "status": "FINALIZADA"
}
```

7. **Cliente avalia pedido**
```bash
POST /api/avaliacoes
Authorization: Bearer TOKEN
{
  "id_venda": 1,
  "nota": 5,
  "comentario": "Excelente!"
}
```

---

### Exemplo com cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/pessoas/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

**Listar produtos:**
```bash
curl -X GET http://localhost:3001/api/produtos
```

**Criar pedido:**
```bash
curl -X POST http://localhost:3001/api/vendas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "itens": [
      {"id_produto": 1, "quantidade": 2}
    ],
    "tipo_entrega": "ENTREGA"
  }'
```

---

## Como Executar

### Instalar dependências

```bash
npm install
```

### Executar a API

```bash
npm run api
```

A API estará disponível em `http://localhost:3001`
