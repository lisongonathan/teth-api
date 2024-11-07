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
                    `
        try {
            const result = await this.execute(sql, [])
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
                    `
        try {
            const result = await this.execute(sql, [])
        } catch (error) {
            throw error;
            
        }
    }
}

module.exports = QuestionModel