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
    
    const sql = 'SELECT * FROM agent WHERE pseudo = ? AND mdp = ?';
    try {
      const user = await this.execute(sql, [matricule, password]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM agent WHERE agent.e_mail=?';
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

  async getAgentByEmail(email) {
    // Implement the logic to get agent by email
  }

  async updateAgentPassword(password, userId) {
    // Implement the logic to update agent password
  }

  async getAgentByAuth(matricule, password) {
    // Implement the logic to get agent by matricule and password
  }

  // async getUser(email) {
  //   return new Promise((resolve, reject) => {
  //     const query = 'SELECT * FROM users WHERE email = ?';
  //     db.query(query, [email], (err, results) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       resolve(results);
  //     });
  //   });
  // }
}

module.exports = AuthModel;
