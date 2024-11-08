const UserModel = require('./UserModel');

class FinanceModel extends UserModel {
    constructor() {
        super();
    }

    async getAllVendeurs() {
        const sql = `SELECT * FROM point_vente`
        
            try {
                const result = await this.execute(sql, []);

                return result;
            } catch (error) {
                throw error;
                
            }
    }


    async getAllJetons() {
        const sql = `SELECT id, designation
            FROM jetons`
        
            try {
                const result = await this.execute(sql, []);

                return result;
            } catch (error) {
                throw error;
                
            }
    }

    async getVentesJetonsMensuelles() {
        const sql = `SELECT
                        j.id AS jeton_id,
                        j.designation AS jeton_designation,
                        MONTH(cj.date_cmd) AS month,
                        SUM(cj.qte) AS ventes
                    FROM
                        cmd_jeton cj
                    INNER JOIN
                        jetons j ON cj.id_jeton = j.id
                    GROUP BY
                        j.id, MONTH(cj.date_cmd)
                    ORDER BY
                        jeton_id, month
                    `
        
        try {
            const result = await this.execute(sql, []);

            return result;
        } catch (error) {
            throw error;
            
        }
    }    

    async getVentesJetons() {
        const sql = `SELECT
                        cj.id AS cmd_id,
                        j.designation AS jeton_designation,
                        cj.date_cmd,
                        cj.qte,
                        j.pieces,
                        j.montant,
                        u.matricule,
                        u.image,
                        u.telephone,
                        u.e_mail,
                     	pv.date_creation,
                        cj.statut AS cmd_state
                    FROM
                        cmd_jeton cj
                    INNER JOIN
                        jetons j ON cj.id_jeton = j.id
                    INNER JOIN point_vente pv ON pv.id = cj.id_point_vente
                    INNER JOIN user u ON u.id = pv.id_user
                    `
        
        try {
            const result = await this.execute(sql, []);

            return result;
        } catch (error) {
            throw error;
            
        }
    } 

    async getAllTransactions(){
        const sql = `SELECT * FROM cagnotte`;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getAllUsers(){
        const sql = `SELECT * FROM client`;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getAllRetraits(){
        const sql = `SELECT r.id, r.date_retrait, r.montant, r.statut, c.matricule, c.solde, c.photo, c.telephone, c.e_mail , u.matricule AS user_mat, u.image  AS user_photo, rl.designation AS user_role
                    FROM retrait r
                    INNER JOIN client c ON c.id = r.id_client
                    INNER JOIN user u ON u.id = r.id_user
                    INNER JOIN affectation aft ON aft.id_user = u.id
                    INNER JOIN role rl ON rl.id = aft.id_role`;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getCapital(){
        const sql = `
                SELECT 
                    COALESCE(SUM(debit), 0) AS total_debit,
                    COALESCE(SUM(credit), 0) AS total_credit
                FROM 
                    cagnotte`;
        try {
            const result = await this.execute(sql, []);
            return result;
            
        } catch (error) {
            throw error;
            
        }
    }
}

module.exports = FinanceModel