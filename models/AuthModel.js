const Model = require('./Model');

class AuthModel extends Model {
  constructor() {
    super(); // Appelle le constructeur du modèle principal
  }

  async createAgent(name, phone, email) {
    const sql = 'INSERT INTO agent (name, phone, e_mail) VALUES (?, ?, ?)';
    const params = [name, phone, email];
    try {
      const result = await this.execute(sql, params);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async createUser(name, email, mdp) {
    console.log({name, email, mdp})
    const sql = 'INSERT INTO user (pseudo, e_mail, mdp, parties) VALUES (?, ?, ?, 3)';
    const params = [name, email, mdp];
    try {
      const result = await this.execute(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createLevelUser(id) {
    console.log({id})
    const sql = 'INSERT INTO detail_level (id_user) VALUES (?)';
    const params = [id];
    try {
      const result = await this.execute(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createNotification(message, id_user) {
    const sql = 'INSERT INTO notification (id_user, message) VALUES (?, ?)';
    const params = [id_user, message];
    try {
      const result = await this.execute(sql, params);
      return result;
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

  async readUserByAuth(matricule, password) {
    
    const sql = `SELECT user.*, levels.designation AS 'level'
                FROM user 
                INNER JOIN detail_level ON detail_level.id_user = user.id
                INNER JOIN levels ON levels.id = detail_level.id_level
                WHERE pseudo = ? AND mdp = ?`;
    try {
      const user = await this.execute(sql, [matricule, password]);
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async readUserById(id) {
    
    const sql = `SELECT user.*, levels.designation AS 'level'
                FROM user 
                INNER JOIN detail_level ON detail_level.id_user = user.id
                INNER JOIN levels ON levels.id = detail_level.id_level
                WHERE user.id = ?`;
    try {
      const user = await this.execute(sql, [id]);
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

  async updatePartiesUser(parties, id) {
    const sql = 'UPDATE user SET user.parties = ? WHERE user.id = ?';

    try {
      const user = await this.execute(sql, [parties, id]);
      return user
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

  async updatePasswordUser(mdp, id) {
    const sql = 'UPDATE user SET user.mdp = ? WHERE user.id = ?';

    try {
      const user = await this.execute(sql, [mdp, id]);
      return user
    } catch (error) {
      throw error;
    }
  }

  async checkPseudoUser(pseudo) {
    const sql = 'SELECT * FROM user WHERE pseudo = ?';
    try {
      const user = await this.execute(sql, [pseudo]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkMailUser(email) {
    const sql = 'SELECT * FROM user WHERE e_mail = ?';
    try {
      const user = await this.execute(sql, [email]);
      return user;
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
