# REST API with JWT Authentication & Pagination

## Introduction
I developed a robust RESTful API with JWT (JSON Web Token) authentication, ensuring secure and efficient communication between clients and the server. This application facilitates seamless data exchange and user access control, it also includes pagination for better performance when GET data from the server, to showcasing my expertise in web development and security best practices.

### Tech Stack 💻 :
- ExpressJS
- NodeJS
- Mysql
- Prisma
- JWT (JSON Web Token)

### Cloning the repository

```shell
git clone https://github.com/inifarhan/rest-api-with-jwt-and-pagination.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

PORT=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_SECRET=
DATABASE_URL=
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
