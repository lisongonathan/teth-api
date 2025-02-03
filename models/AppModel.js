const FinanceModel = require('./FinanceModel');

class AppModel extends FinanceModel {
    constructor(){
        super()
    }

    async getNotificationsByUser(id) {
      const sql = `SELECT *
                  FROM notification
                  WHERE notification.id_user = ?
                  ORDER BY id DESC
                  LIMIT 5`;
      try {
        const result = await this.execute(sql, [id]);
        return result;
  
      } catch (error) {
        throw error;
      }
    }

    async getHistoryQuizUser(userId, categorieId) {
      const sql = `SELECT detail_partie.*, parties.id_user
                  FROM detail_partie
                  INNER JOIN parties ON parties.id = detail_partie.id_partie
                  WHERE parties.id_user = ? AND parties.id_categorie = ?
                `;
      try {
        const result = await this.execute(sql, [userId, categorieId]);
        return result;
  
      } catch (error) {
        throw error;
      }
    }

    async getNewQuestions(categorieId, lastQuiz) {
      const sql = `SELECT *
                  FROM question
                  WHERE question.id_categorie = ? AND question.id NOT IN (?)
                  ORDER BY RAND()
                  LIMIT 3
                `;
      try {
        const result = await this.execute(sql, [categorieId, lastQuiz.length ? lastQuiz : [0]]);
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

    async updateStatutPartie(statut, id) {
      const sql = 'UPDATE parties SET status = ? WHERE id = ?';
  
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

    async createPartie(userId, categorieId) {
      const sql = 'INSERT INTO parties (id_user, id_categorie) VALUES (?, ?)';
      const params = [userId, categorieId];
      try {
        const result = await this.execute(sql, params);
        return result.data;
      } catch (error) {
        throw error;
      }
    }

    async createNewJeu(quiz1, quiz2, quiz3, partieId) {
      const sql = 'INSERT INTO detail_partie (id_quizz_1, id_quizz_2, id_quizz_3, id_partie) VALUES (?, ?, ?, ?)';
      const params = [quiz1, quiz2, quiz3, partieId];
      try {
        const result = await this.execute(sql, params);
        return result.insertId;
      } catch (error) {
        throw error;
      }
    }

    async getLeaderboard() {
      const sql = `
        SELECT u.id, u.photo, u.pseudo,
               IFNULL(COUNT(p.id) * 3, 0) as totalQuestionsOk,
               IFNULL(COUNT(p.id) * 2500, 0) as totalGains
        FROM user u
        LEFT JOIN parties p ON u.id = p.id_user AND p.status = 'OK'
        GROUP BY u.id
        ORDER BY totalGains DESC
        LIMIT 10
      `;
      try {
        const result = await this.execute(sql);
        return result;
      } catch (error) {
        throw error;
      }
    }
}

module.exports = AppModel;