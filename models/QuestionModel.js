const UserModel = require('./UserModel');

class QuestionModel extends UserModel {
    constructor(){
        super()
    }

    async getQuestionsOkByMonth(){
        const sql = `SELECT 
                        MONTH(date_creation) AS month,
                        COUNT(*) AS questions_reussies
                    FROM 
                        jeu
                    INNER JOIN partie ON partie.id = jeu.id_partie
                    WHERE 
                        jeu.statut = 'OK'
                    GROUP BY 
                        MONTH(date_creation)
                    ORDER BY 
                        month
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getQuestionsNoByMonth(){
        const sql = `SELECT 
                        MONTH(date_creation) AS month,
                        COUNT(*) AS questions_reussies
                    FROM 
                        jeu
                    INNER JOIN partie ON partie.id = jeu.id_partie
                    WHERE 
                        jeu.statut = 'NO'
                    GROUP BY 
                        MONTH(date_creation)
                    ORDER BY 
                        month
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getAllDetailsParties(){
        const sql = `SELECT partie.id, partie.date_creation, client.matricule, client.photo, client.id_niveau, client.telephone, client.e_mail, partie.statut, categorie.designation, question.intitule, question.image, question.type, question.duree, jeu.statut, question.correct
                    FROM partie
                    INNER JOIN jeu ON jeu.id_partie = partie.id
                    INNER JOIN question ON question.id = jeu.id_question
                    INNER JOIN client ON client.id = partie.id_client
                    INNER JOIN categorie ON categorie.id = partie.id_categorie
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }
}

module.exports = QuestionModel