const mysql = require('mysql2');
require('dotenv').config();

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      this.db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      this.db.connect((err) => {
        if (err) {
          console.error('Erreur de connexion à la base de données :', err.stack);
          return;
        }
        console.log('Connecté à la base de données MySQL en tant que ID = ' + this.db.threadId);
      });

      instance = this;
    }

    return instance;
  }

  getDb() {
    return this.db;
  }
}

module.exports = new Database().getDb();
