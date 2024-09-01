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

  async getUserByPhone(phone) {
    const sql = 'SELECT * FROM user WHERE phone = ?';
    try {
      const user = await this.execute(sql, [phone]);
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM user WHERE e_mail = ?';
    try {
      const user = await this.execute(sql, [email]);
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async getRules() {
    const sql = 'SELECT rules FROM app'; // Assurez-vous que cette table existe et contient les règles
    try {
      const rules = await this.execute(sql);
      return rules;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthModel();
