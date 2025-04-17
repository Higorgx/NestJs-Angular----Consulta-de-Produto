# 🛒 Sistema de Consulta e Cadastro de Produtos

Este projeto é composto por um **backend em NestJS** e um **frontend em Angular**, ambos dockerizados, para permitir o **cadastro, edição, exclusão e consulta de produtos**. A aplicação também permite o gerenciamento de preços por loja.

---

## 🔧 Tecnologias Utilizadas

- **NestJS** (API REST com TypeORM e Swagger)
- **Angular** (Standalone Components, Reactive Forms)
- **PostgreSQL** (base de dados)
- **Docker & Docker Compose**

---

## 📁 Estrutura do Projeto

```
/backend         # API REST NestJS
/frontend        # Aplicação Angular
/docker-compose.yml
```

---

## ▶️ Como Executar o Projeto

### 1. Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 3. Subir os containers

```bash
docker-compose up --build
```

O Docker irá:

- Subir o banco de dados PostgreSQL
- Subir a API NestJS em `http://localhost:3000`
- Subir o Angular em `http://localhost:4200`

---

## 🔙 Backend (NestJS)

### Acesso

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### Funcionalidades

- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Consulta com filtros, ordenação e paginação
- Upload de imagem (opcional)
- Associação de preços por loja

---

## 🖥️ Frontend (Angular)

### Acesso

- Angular: `http://localhost:4200`

### Funcionalidades

- Listagem de produtos com filtros e paginação
- Cadastro e edição de produtos via formulário
- Modal para gerenciar preços por loja
- Confirmação de exclusão
- Upload de imagem

---

## 🐳 Docker

### Comandos úteis

- Subir: `docker-compose up --build`
- Derrubar: `docker-compose down`
- Rebuild: `docker-compose up --build --force-recreate`
- Acessar container:
  ```bash
  docker exec -it backend bash
  ```

---

## 📂 Banco de Dados

- Banco: `postgres`
- Host: `localhost`
- Porta: `5432`
- Usuário: `postgres`
- Senha: `root`
- Base: `cadastro_produto`

> A conexão e as credenciais podem ser alteradas no `.env` do backend ou no `docker-compose.yml`.

---

## ✅ Testes

### Backend

```bash
docker exec -it backend npm run test
```

> Os testes cobrem serviços e controladores com cobertura mínima de 80%.

---

Feito com ❤️ usando NestJS + Angular
