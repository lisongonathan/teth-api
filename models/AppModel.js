const UserModel = require('./UserModel');

class AppModel extends UserModel {
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
        const user = await this.execute(sql, [parties, id]);
        return user
      } catch (error) {
        throw error;
      }
    }
}

module.exports = AppModel;