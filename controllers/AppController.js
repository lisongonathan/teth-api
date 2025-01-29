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

    response (statut, message, data) {
        return {
            statut,
            message,
            data
        }
    }
}

module.exports = AppController;