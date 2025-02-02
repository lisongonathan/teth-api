const mysql = require('mysql2');
require('dotenv').config();

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4', // Added charset for proper encoding
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error('Erreur de connexion à la base de données :', err.stack);
          return;
        }
        console.log('Connecté à la base de données MySQL');
        connection.release();
      });

      instance = this;
    }

    return instance;
  }

  getPool() {
    return this.pool;
  }
}

module.exports = new Database().getPool();
