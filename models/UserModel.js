const AuthModel = require('./AuthModel');

class UserModel extends AuthModel {
  constructor() {
    super(); // Appelle le constructeur du modèle principal
  }

  async getUserSession(id) {
    const sql = `SELECT affectation.id, affectation.statut, affectation.date_creation, role.designation, role.image, role.description
                FROM affectation
                INNER JOIN role ON role.id = affectation.id_role
                WHERE affectation.id_user = ?`;
    try {
      const result = await this.execute(sql, [id]);
      return result;
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserModel();
