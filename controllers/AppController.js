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

    async checkCagnote(req, res){

        const cagnote = await this.currentCagnote();
        res.json(cagnote)
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
        const userInfo = await this.appModel.readUserById(id_user);
        const jetonInfo = await this.appModel.getJetonById(id_jeton);

        const payload = {
            id: userInfo.data[0].id,
            solde: parseFloat(userInfo.data[0].solde) - parseFloat(jetonInfo.data[0].mise),
            parties: parseInt(userInfo.data[0].parties) + parseInt(jetonInfo.data[0].cote) + parseInt(jetonInfo.data[0].bonus),
        }

        await this.appModel.updatePartiesUser(payload.parties, payload.id);
        await this.appModel.updateSoldeUser(payload.solde, payload.id);
        const textNotification = `Félicitation vous avez acheté un jeton de ${jetonInfo.data[0].designation} et vous disposez maintenant de ${payload.parties} parties`
        await this.newNotifcation({message: textNotification, id: payload.id})
        
        res.json(payload);

    }

    async jeu (req, res) {
        const {id_user, id_categorie, parties} = req.body;
        await this.appModel.updatePartiesUser(parties, id_user);
        const resultLastQuestions = await this.appModel.getHistoryQuizUser(id_user, id_categorie);
        // res.json(resultLastQuestions);
        const playedQuestions = resultLastQuestions.data.length ? resultLastQuestions.data.flatMap(row => [row.id_quizz_1, row.id_quizz_2, row.id_quizz_3]) : [];
        const resultNewQuestions = await this.appModel.getNewQuestions(id_categorie, playedQuestions);
        const newPartie = await this.appModel.createPartie(id_user, id_categorie);
        await this.appModel.createNewJeu(resultNewQuestions.data[0].id, resultNewQuestions.data[1].id, resultNewQuestions.data[2].id, newPartie.insertId);
        res.json({...resultNewQuestions, partieId: newPartie.insertId});
        // res.json(newPartie.insertId);
    }

    async resultJeu (req, res){
        const {id_user, id_partie, solde, statut} = req.body;

        let message;

        if (statut == 'OK') {
            message = `Félicitation vous avez remporté 2500Fc, ce qui remonte votre solde à ${solde} FC -:)`;
        } else {
            message = `Bravo pour vos efforts ! Vous n'avez pas perdu : vous avez appris et évolué pour la prochaine partie.`
        }
        await this.appModel.updateSoldeUser(solde, id_user);
        await this.appModel.updateStatutPartie(statut, id_partie);
        await this.appModel.createNotification(message, id_user)

        res.json({
            statut: 200,
            message: 'Voulez vous rejouer une partie',
            data:{
                solde: solde
            }
        })
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