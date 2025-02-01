const FinanceModel = require('./FinanceModel');

class AppModel extends FinanceModel {
    constructor(){
        super()
    }

    async getNotificationsByUser(id) {
      const sql = `SELECT *
                  FROM notification
                  WHERE notification.id_user = ?`;
      try {
        const result = await this.execute(sql, [id]);
        return result;
  
      } catch (error) {
        throw error;
      }
    }

    async updateStatutNotification(statut, id) {
      const sql = 'UPDATE notification SET statut = ? WHERE id = ?';
  
      try {
        const user = await this.execute(sql, [statut, id]);
        return user
      } catch (error) {
        throw error;
      }
    }

    async updateSoldeUser(solde, id) {
      const sql = 'UPDATE user SET user.solde = ? WHERE user.id = ?';
  
      try {
        const user = await this.execute(sql, [solde, id]);
        return user
      } catch (error) {
        throw error;
      }
    }

    async createCmdToken(jeton, user, statut, ref) {
      const sql = 'INSERT INTO detail_jeton (id_jeton, id_user, statut, ref) VALUES (?, ?, ?, ?)';
      const params = [jeton, user, statut, ref];
      try {
        const result = await this.execute(sql, params);
        return result;
      } catch (error) {
        throw error;
      }
    }
}

module.exports = AppModel;