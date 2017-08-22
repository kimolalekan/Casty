//config
  module.exports = {
    rethinkdb: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      authKey: '',
      db: process.env.DB_NAME
    },
    express: {
       port: process.env.BACKEND_PORT
    }
  };
