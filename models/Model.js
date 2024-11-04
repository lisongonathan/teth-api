const db = require('../config/db');

class Model {
  constructor() {
    this.db = db;
    this.sql = '';
    this.params = [];
  }

  // Méthode générique pour exécuter une requête SQL
  execute(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, results) => {
        if (err) {
          return reject({
            status: 500,
            msg: 'Erreur lors de l\'exécution de la requête',
            data: err
          });
        }

        resolve({
          status: 200,
          msg: 'Requête exécutée avec succès',
          data: results
        });
      });
    });
  }

  // Méthode générique pour exécuter une requête de recherche SQL
  searchQuery(sql, searchTerm) {
    this.sql = sql;
    this.params = [`%${searchTerm}%`];
    return this.query(this.sql, this.params);
  }

  // Méthode pour obtenir le dernier ID inséré
  getLastInsertId() {
    const sql = `SELECT LAST_INSERT_ID() AS lastInsertId`;
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject({
            status: 500,
            msg: "Erreur lors de l'obtention de l'ID du dernier enregistrement inséré",
            data: err
          });
        }

        resolve({
          status: 200,
          msg: "Dernier ID inséré obtenu avec succès",
          data: results[0].lastInsertId
        });
      });
    });
  }
}

module.exports = Model;
