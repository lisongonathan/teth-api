const UserModel = require('./UserModel');

class FinanceModel extends UserModel {
    constructor() {
        super();
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
}

module.exports = FinanceModel