// backend/knexfile.js
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'admin',
      database: 'painel_util_db'
    },
    migrations: {
      directory: './migrations'
    }
  },
};