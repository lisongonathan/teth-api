const Model = require('./Model');

class AuthModel extends Model {
  constructor() {
    super(); // Appelle le constructeur du modèle principal
  }

  async registerUser(name, phone, email) {
    const sql = 'INSERT INTO user (name, phone, e_mail) VALUES (?, ?, ?)';
    const params = [name, phone, email];
    try {
      const result = await this.execute(sql, params);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async getUserByMatricule(matricule, password) {
    console.log(matricule)
    const sql = 'SELECT * FROM user WHERE matricule = ? AND mdp = ?';
    try {
      const user = await this.execute(sql, [matricule, password]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM user WHERE e_mail = ?';
    try {
      const user = await this.execute(sql, [email]);
      return user;

    } catch (error) {
      throw error;
    }
  }

  async setPasswordUser(mdp, id) {
    const sql = 'UPDATE user SET user.mdp = ? WHERE user.id = ?';

    try {
      const user = await this.execute(sql, [mdp, id]);
      return user
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthModel;
