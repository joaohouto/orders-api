# 📦 API - Rotas

## 🧑‍💼 Auth

### `GET /auth/google`

- **Descrição**: Inicia login com Google.

---

## 🛍️ Orders

### `GET /orders`

- **Descrição**: Lista todos os pedidos.

### `POST /orders`

- **Descrição**: Cria um novo pedido.
- **Body**:

```json
{
  "storeId": "string",
  "products": [
    {
      "productId": "string",
      "variation": "string",
      "quantity": number
    }
  ]
}
```

---

## 🏪 Stores

### `GET /stores/mine`

- **Descrição**: Lista todas as lojas do usuário.

### `POST /stores`

- **Descrição**: Cria uma nova loja.
- **Body**:

```json
{
  "name": "string"
}
```

### `GET /stores/:storeSlug`

- **Descrição**: Detalhes de uma loja.

---

## 👕 Products

### `POST /stores/:storeId/products`

- **Descrição**: Cria um novo produto numa loja.
- **Body**:

```json
{
  "slug": "string",
  "name": "string",
  "price": number,
  "description": "string",
  "variations": [
    { "name": "string", "price": number }
  ],
  "image": "string"
}
```

---

## 🧑‍🤝‍🧑 Colaboradores

### `POST /stores/:storeId/collaborators`

- **Descrição**: Adiciona um colaborador à loja.
- **Body**:

```json
{
  "email": "string",
  "access": "viewer" | "editor"
}
```

## 📁 Arquivos

### `POST /files/upload`

- **Descrição**: Faz o upload de um arquivo.
- **Body**:

```json
{
  "file": File,
}
```

---
