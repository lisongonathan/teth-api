const AuthController = require('./AuthController');
const UserModel = require('../models/UserModel');

class UserController extends AuthController {
  constructor() {
    super();
    this.userModel = UserModel


  }

  async sessions(req, res) {
    const { id } = req.body;
    try {
      const result = await this.userModel.getUserSession(id);

  
      if (result?.data.length) {
        res.json(this.sendResponse(res, 200, 'Récupération sessions avec succès', result.data));

      } else {
        res.json(this.sendResponse(res, 404, 'Sessions non trouvé', result));

      }
    } catch (error) {
      res.json(this.sendResponse(res, 500, 'Erreur lors du traitement de la requette', error));
    }
  }

}

module.exports = new UserController();
