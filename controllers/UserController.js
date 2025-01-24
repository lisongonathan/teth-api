const AuthController = require('./AuthController');
const UserModel = require('../models/UserModel');

class UserController extends AuthController {
  constructor() {
    super();
    this.userModel = new UserModel();


  }

  async sessions(req, res) {
    const { id } = req.body;
    console.log(id)
    try {
      
      const result = await this.userModel.getUserSession(id);
      if (result?.data.length) {
        return res.json({ status: 200, message: 'Succès', data: result.data });

      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });

      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }


  async splash(req, res) {
    try {
      const rules = await this.userModel.getAllUsers();
      this.sendResponse(res, 200, 'Règles récupérées avec succès', rules);
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur lors de la récupération des règles', error);
    }

  }

  async agents(req, res) {
    try {
      const users = await this.userModel.getAllUsers();
      console.log(users)
      this.sendResponse(res, 200, 'Agents récupérés avec succès', users);
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur lors de la récupération des agents', error);
    }
  }

}

module.exports = UserController;
