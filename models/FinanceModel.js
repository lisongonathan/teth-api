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
        const sql = `SELECT *
            FROM jeton`
        
            try {
                const result = await this.execute(sql, []);

                return result;
            } catch (error) {
                throw error;
                
            }
    }
    async getJetonById(id) {
    
        const sql = `SELECT *
                    FROM jeton
                    WHERE jeton.id = ?`;
        try {
            const user = await this.execute(sql, [id]);
            return user;
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
        const sql = `SELECT detail_level.id_level, levels.designation, detail_level.id_user, user.solde, user.pseudo, user.telephone, detail_jeton.id_jeton, detail_jeton.statut, detail_jeton.ref, detail_jeton.id
              FROM detail_level
              INNER JOIN user ON user.id = detail_level.id_user
              INNER JOIN levels ON levels.id = detail_level.id_level
              INNER JOIN detail_jeton ON detail_jeton.id_user = user.id
            `
        
        try {
            const result = await this.execute(sql, []);

            return result;
        } catch (error) {
            throw error;
            
        }
    } 

    async getVentesByJeton() {
        const sql = `SELECT 
                        jetons.designation AS modalite,                      -- Nom du jeton (ex. 'Jeton A')
                        COALESCE(SUM(cmd_jeton.qte), 0) AS effectif         -- Quantité totale vendue, 0 si aucune vente
                    FROM 
                        jetons
                    LEFT JOIN 
                        cmd_jeton ON jetons.id = cmd_jeton.id_jeton 
                        AND cmd_jeton.statut = 'OK'                          -- Seules les ventes avec statut 'OK'
                    GROUP BY 
                        jetons.designation  
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