# 🚀 Painel de Utilidades para Devs

![Status do Projeto](https://img.shields.io/badge/status-em_desenvolvimento-yellow)

> Aplicação full stack que serve como um painel de utilidades, incluindo um sistema de autenticação de usuários e um feed de notícias de tecnologia consumido de uma API externa.

---

## 🎯 Sobre o Projeto

Este projeto foi construído para ser um painel central de ferramentas e informações para desenvolvedores. A aplicação é dividida em duas partes principais:

1.  **Backend (API RESTful):** Desenvolvido em **Node.js** com **Express**, é responsável por toda a lógica de negócio, autenticação de usuários e comunicação com o banco de dados PostgreSQL.
2.  **Frontend:** Construído em **React**, oferece uma interface de usuário reativa para interação com a API, permitindo que os usuários se registrem, façam login e acessem as funcionalidades do painel.

---

## ✨ Funcionalidades

- **Autenticação de Usuários:** Sistema registro e login.
- **Segurança:** Senhas criptografadas com `bcryptjs` e sessões de usuário gerenciadas com **JSON Web Tokens (JWT)**.
- **Rotas Protegidas:** Acesso a dados do perfil do usuário apenas para usuários autenticados.
- **Feed de Notícias:** Rota que busca e exibe as últimas notícias de tecnologia em português, utilizando a API da [GNews](https://gnews.io/).
- **Gerenciamento de Banco de Dados:** Uso do **Knex.js** para executar e gerenciar as `migrations` do banco de dados de forma versionada.

---

## 🛠️ Arquitetura e Tecnologias

| Componente         | Tecnologias Utilizadas                                   |
| :----------------- | :------------------------------------------------------- |
| **Frontend**       | `React`, `CSS`                                           |
| **Backend**        | `Node.js`, `Express.js`, `Knex.js`                       |
| **Banco de Dados** | `PostgreSQL`                                             |
| **Autenticação**   | `bcrypt.js`, `JSON Web Token (JWT)`                      |
| **Ferramentas**    | `Git`, `GitHub`, `Postman`, `Dotenv`, `Nodemon`, `Axios` |

```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio
```
