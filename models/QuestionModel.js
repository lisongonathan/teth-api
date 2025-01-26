const UserModel = require('./UserModel');

class QuestionModel extends UserModel {
    constructor(){
        super()
    }

    async addCategory(designation, description) {
        const sql = `INSERT INTO categorie (designation, description) VALUES (?, ?)`;
        try {
          const result = await this.execute(sql, [designation, description]);
          
          return result.data.insertId;
        } catch (error) {
          throw error;
        }
      }

    async addQuestion(enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent) {
        const sql = `INSERT INTO question (
                        enonce, 
                        duree_sec, 
                        id_categorie, 
                        choix_1, 
                        choix_2, 
                        choix_3, 
                        choix_4, 
                        reponse, 
                        id_agent
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
          const result = await this.execute(sql, [enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent]);
          return result.data.insertId;
        } catch (error) {
          throw error;
        }
      }

    async updateCategory(id, designation, description) {
        const sql = `UPDATE categorie SET designation = ?, description = ? WHERE id = ?`;
        try {
          const result = await this.execute(sql, [designation, description, id]);
          return result;
        } catch (error) {
          throw error;
        }
      }

    async deleteCategory(id) {
        const sql = `DELETE FROM categorie WHERE id = ?`;
        try {
          const result = await this.execute(sql, [id]);
          return result;
        } catch (error) {
          throw error;
        }
      }

    async updateQuestion(id, enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent) {
        const sql = `UPDATE question SET enonce = ?, duree_sec = ?, id_categorie = ?, choix_1 = ?, choix_2 = ?, choix_3 = ?, choix_4 = ?, reponse = ?, statut = ?, id_agent = ? WHERE id = ?`;
        try {
          const result = await this.execute(sql, [enonce, duree_sec, id_categorie, choix_1, choix_2, choix_3, choix_4, reponse, statut, id_agent, id]);
          return result;
        } catch (error) {
          throw error;
        }
      }

    async deleteQuestion(id) {
        const sql = `DELETE FROM question WHERE id = ?`;
        try {
          const result = await this.execute(sql, [id]);
          return result;
        } catch (error) {
          throw error;
        }
      }
}

module.exports = QuestionModel