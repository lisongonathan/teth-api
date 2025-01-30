const UserController = require('./UserController')
const AppModel = require('../models/AppModel');

class AppController extends UserController {
    constructor() {
        super();

        this.appModel = new AppModel();
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
        await this.appModel.updateStatutNotification(data.statut, data.id)

        this.notificationsUser(data.id)
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