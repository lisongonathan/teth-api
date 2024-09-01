const BaseController = require('./Controller');
const AuthModel = require('../models/AuthModel');

class AuthController extends BaseController {
  constructor() {
    super();
    this.model = AuthModel
  }

  // Exemple de méthode pour créer un utilisateur
  async login(req, res) {
    try {
      const userData = req.body;
      const result = await model.getUserByPhone(userData);

      // Utilisation de la méthode sendResponse pour envoyer la réponse
      this.sendResponse(res, result.status, result.msg, result.data);
    } catch (err) {
      // Gestion des erreurs avec sendResponse
      this.sendResponse(res, err.status || 500, err.msg || "Erreur interne du serveur", err.data);
    }
  }

  // D'autres méthodes de contrôleur peuvent être ajoutées ici
}

module.exports = new AuthController();
