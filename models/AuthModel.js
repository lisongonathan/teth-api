const Model = require('./Model');

class AuthModel extends Model {
  constructor() {
    super(); // Appelle le constructeur du modèle principal
  }

  // Requête spécifique pour obtenir un utilisateur par son téléphone
  getUserByPhone(phone) {
    const sql = `
        SELECT * 
        FROM user 
        WHERE phone = ?
    `;
    const params = [phone];
    return this.query(sql, params);
  }

  // Autres requêtes spécifiques peuvent être ajoutées ici
}

module.exports = new AuthModel();
