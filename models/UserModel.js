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

  async getAllUsers(){
      const sql = `SELECT * FROM user`;
      try {
          const result = await this.execute(sql, []);
          return result;
          
      } catch (error) {
          throw error;
          
      }
  }

  async getRules() {
    const sql = 'SELECT * FROM agent'; // Assurez-vous que cette table existe et contient les règles
    try {
      const rules = await this.execute(sql);
      return rules;
    } catch (error) {
      throw error;
    }
  }

  async getAllCagnotes() {
    const sql = 'SELECT * FROM cagnotes';
    try {
      const result = await this.execute(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPartiesByStatus(status) {
    const sql = `SELECT parties.*, jeton.mise 
              FROM parties 
              INNER JOIN jeton ON jeton.id = parties.id_jeton
              WHERE parties.status = ?
            `;
    try {
      const result = await this.execute(sql, [status]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllQuestions() {
    const sql = `SELECT * FROM question`;
    try {
      const result = await this.execute(sql, []);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories() {
    const sql = `SELECT * FROM categorie`;
    try {
      const result = await this.execute(sql, []);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
