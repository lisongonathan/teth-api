const FinanceModel = require('./FinanceModel');

class AdminModel extends FinanceModel {
    constructor () {
        super();
    }

    async getAllRecettes() {
        const sql = `SELECT cmd_jeton.id, cmd_jeton.date_cmd, jetons.designation, jetons.pieces, cmd_jeton.qte, cmd_jeton.statut, user.image, user.matricule, user.nom, user.post_nom, user.prenom, user.telephone, user.e_mail
                    FROM cmd_jeton
                    INNER JOIN point_vente ON point_vente.id = cmd_jeton.id_point_vente
                    INNER JOIN jetons ON jetons.id = cmd_jeton.id_jeton
                    INNER JOIN user ON user.id = point_vente.id_user`
        
        try {
            const result = await this.execute(sql, []);

            return result;
            
        } catch (error) {
            throw error;
        }
                
    }

    async getRecettesByMonths() {
        const sql = `
            SELECT 
                MONTH(cmd_jeton.date_cmd) AS month, 
                YEAR(cmd_jeton.date_cmd) AS year,
                SUM(jetons.pieces * cmd_jeton.qte) AS total_recettes
            FROM cmd_jeton
            INNER JOIN point_vente ON point_vente.id = cmd_jeton.id_point_vente
            INNER JOIN jetons ON jetons.id = cmd_jeton.id_jeton
            INNER JOIN user ON user.id = point_vente.id_user
            GROUP BY year, month
            ORDER BY year, month
        `;
        
        try {
            const result = await this.execute(sql, []);
            return result;
        } catch (error) {
            throw error;
        }
    }
    

    async getAllDepenses() {
        const sql = `SELECT retrait.id, retrait.date_retrait, retrait.statut, retrait.montant, client.solde, client.matricule, client.nom, client.post_nom, client.photo, client.telephone, client.e_mail
                    FROM retrait
                    INNER JOIN client ON client.id = retrait.id_client`
        
        try {
            const result = await this.execute(sql, []);

            return result;
            
        } catch (error) {
            throw error;
        }
                
    }

    async getDepensesByMonths() {
        const sql = `
            SELECT 
                MONTH(retrait.date_retrait) AS month, 
                YEAR(retrait.date_retrait) AS year,
                SUM(retrait.montant) AS total_depenses
            FROM retrait
            INNER JOIN client ON client.id = retrait.id_client
            GROUP BY year, month
            ORDER BY year, month
        `;
        
        try {
            const result = await this.execute(sql, []);
            return result;
        } catch (error) {
            throw error;
        }
    }    

    async getAllParties(){
        const sql = `SELECT partie.id, categorie.designation, categorie.image, categorie.description, client.matricule, client.telephone, client.e_mail, client.solde, niveau.designation, partie.date_creation, partie.statut
                    FROM partie
                    INNER JOIN categorie ON categorie.id = partie.id_categorie
                    INNER JOIN client ON client.id = partie.id_client
                    INNER JOIN niveau ON niveau.id = client.id_niveau
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getAllTypesUsers(){
        const sql = `SELECT 
                        u.population,
                        SUM(CASE WHEN t.designation = 'Question' THEN 1 ELSE 0 END) AS 'Agents Questions',
                        SUM(CASE WHEN t.designation = 'Finance' THEN 1 ELSE 0 END) AS 'Agents Finance',
                        SUM(CASE WHEN t.designation = 'Client' THEN 1 ELSE 0 END) AS 'Agents Client',
                        SUM(CASE WHEN t.designation = 'Vendeur' THEN 1 ELSE 0 END) AS 'Agents Vender'
                    FROM (
                        SELECT *, COUNT(user.id) population
                        FROM user
                    ) u
                    INNER JOIN affectation ON affectation.id_user = u.id
                    INNER JOIN role t ON t.id = affectation.id_role
                    `;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }

}

module.exports = AdminModel;