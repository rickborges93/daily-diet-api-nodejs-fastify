# Daily Diet API

### 🛠 Tecnologias:
- Fastify - Fast and low overhead web framework, for Node.js
- Typescript
- Zod (validation)
- Sqlite3 (database)
- DotEnv (environment variables)
- ESLint (format code)
- Tsup (build project)
- Supertest (tests)
- Vitest (tests)

### Regras da aplicação

- Deve ser possível criar um usuário
- Deve ser possível identificar o usuário entre as requisições
- Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- Deve ser possível apagar uma refeição
- Deve ser possível listar todas as refeições de um usuário
- Deve ser possível visualizar uma única refeição
- Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

### 🚀 Rode o projeto
Clone o projeto e acesse a pasta raiz.

```bash
$ git clone https://github.com/rickborges93/daily-diet-api-nodejs-fastify.git
$ cd daily-diet-api-nodejs-fastify
```
Inicie o projeto seguindo estes passos:
```bash
# Instale as dependências
$ npm install

# Rode as migrations
$ npm run knex -- migrate:latest

# Por fim, rode o projeto
$ npm run dev
```
Agora poderão ser feitas as requisições pela URL: http://localhost:3333