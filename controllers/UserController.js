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

  hello(req, res) {
    console.log(req)
  }

}

module.exports = UserController;
