const FinanceController = require('./FinanceController')
const AppModel = require('../models/AppModel');
const QuestionModel = require('../models/QuestionModel');

class AppController extends FinanceController {
    constructor() {
        super();

        this.appModel = new AppModel();
        this.quizModel = new QuestionModel();
    }

    async currentCagnote (){
        const solde = await this.sommeRebours()

        if (solde) {
            return this.response(200, "Cagnote disponible", solde);
        } else {
            return this.response(404, 'Cagnote indisponible', null)
        }
    }

    async newNotifcation(data){
        await this.appModel.createNotification(data.message, data.id)

        this.notificationsUser(data.id)
    }

    async notificationsUser(id){
        const response = await this.appModel.getNotificationsByUser(id)

        return response;
    }

    async readNotification(data){
        console.log('Read notification', data)
        let id = data[0].id
        data.map(async (n) => {
            await this.appModel.updateStatutNotification('OK', n.id)
            
        })

        this.notificationsUser(id)
    }

    /**
     * Renvoie la liste de tous les tokens
     * @param {Request} req - La requ te
     * @param {Response} res - La r ponse
     * @returns {Promise<void>}
     */
    async allTokens (req, res) {
        const tokens = await this.appModel.getAllJetons()
        console.log('tokens', tokens)
        res.json(tokens)
    }

    async buyToken(req, res){
        const {id_user, id_jeton} = req.body;
        const ref = `${id_user}.${id_jeton}.${Date.now()}`;
        const response = await this.appModel.createCmdToken(id_jeton, id_user, 'OK', ref)
        const userInfo = await this.appModel.readUserById(id_user)
        
        res.json(userInfo)

    }

    response (statut, message, data) {
        return {
            statut,
            message,
            data
        }
    }
}

module.exports = AppController;