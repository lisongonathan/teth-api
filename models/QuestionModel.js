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

    async getAllCategories(){
        const sql = `SELECT * FROM categorie`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getAllQuestions(){
        const sql = `SELECT * FROM question`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getAllNiveaux(){
        const sql = `SELECT * FROM niveau`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getAllReussitesByCategorie(){
        const sql = `
                SELECT categorie.id, AVG(CASE WHEN jeu.statut = 'OK' THEN 1 ELSE 0 END) * 100 AS tauxReussite
                FROM categorie
                LEFT JOIN question ON question.id_categorie = categorie.id
                LEFT JOIN jeu ON jeu.id_question = question.id
                GROUP BY categorie.id`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getAvgDureeAllQuestions(){
        const sql = `SELECT AVG(duree) AS dureeMoyenne FROM question`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getQuestionsNo(){
        const sql = `
                SELECT COUNT(*) AS totalQuestionsEchouees 
                FROM jeu 
                WHERE statut = 'NO'
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getQuestionsOk(){
        const sql = `
                SELECT COUNT(*) AS totalQuestionsReussites 
                FROM jeu 
                WHERE statut = 'OK'
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }

    async getOcuurQuestions(){
        const sql = `
                SELECT COUNT(*) / COUNT(DISTINCT id_question) AS frequenceMoyenneApparition
                FROM jeu`;
        try {
            const result = await this.execute(sql, []);
            return result;

        } catch (error) {
            throw error;
            
        }
    }
}

module.exports = QuestionModel