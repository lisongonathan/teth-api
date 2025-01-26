const Model = require('./Model');

class AuthModel extends Model {
  constructor() {
    super(); // Appelle le constructeur du modèle principal
  }

  async createUser(name, phone, email) {
    const sql = 'INSERT INTO agent (name, phone, e_mail) VALUES (?, ?, ?)';
    const params = [name, phone, email];
    try {
      const result = await this.execute(sql, params);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async readAgentByAuth(matricule, password) {
    
    const sql = 'SELECT * FROM agent WHERE pseudo = ? AND mdp = ?';
    try {
      const user = await this.execute(sql, [matricule, password]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async readAgentByEmail(email) {
    const sql = 'SELECT * FROM agent WHERE agent.e_mail=?';
    try {
      const user = await this.execute(sql, [email]);
      return user;

    } catch (error) {
      throw error;
    }
  }

  async updatePasswordAgent(mdp, id) {
    const sql = 'UPDATE agent SET agent.mdp = ? WHERE agent.id = ?';

    try {
      const user = await this.execute(sql, [mdp, id]);
      return user
    } catch (error) {
      throw error;
    }
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
