const BaseController = require('./Controller');
const AuthModel = require('../models/AuthModel');
const path = require('path');

class AuthController extends BaseController {
  constructor() {
    super();
    this.model = AuthModel
  }
  splash(req, res) {
    res.sendFile(path.join(__dirname, '../public/images/splash.png')); // Assurez-vous que le fichier image existe
  }

  logo(req, res) {
    res.sendFile(path.join(__dirname, '../public//images/logo-dark.png')); // Assurez-vous que le fichier image existe
  }

  async rules(req, res) {
    try {
      const rules = await this.authModel.getRules();
      res.json(sendResponse(200, 'Règles récupérées avec succès', rules));
    } catch (error) {
      res.json(sendResponse(500, 'Erreur lors de la récupération des règles', error));
    }
  }

  async login(req, res) {
    const { phone } = req.body;
    try {
      const user = await this.authModel.getUserByPhone(phone);
      if (user) {
        res.json(sendResponse(200, 'Utilisateur authentifié avec succès', user));
      } else {
        res.json(sendResponse(404, 'Utilisateur non trouvé'));
      }
    } catch (error) {
      res.json(sendResponse(500, 'Erreur d\'authentification', error));
    }
  }

  async register(req, res) {
    const { name, phone, email } = req.body;
    try {
      const userId = await this.authModel.registerUser(name, phone, email);
      res.json(sendResponse(200, 'Utilisateur enregistré avec succès', { userId }));
    } catch (error) {
      res.json(sendResponse(500, 'Erreur lors de l\'inscription', error));
    }
  }

  async forgot(req, res) {
    const { email } = req.body;
    try {
      const user = await this.authModel.getUserByEmail(email);
      if (user) {
        // Envoyer un e-mail de récupération ou autre logique
        res.json(sendResponse(200, 'Instructions de récupération envoyées', user));
      } else {
        res.json(sendResponse(404, 'Utilisateur non trouvé'));
      }
    } catch (error) {
      res.json(sendResponse(500, 'Erreur de récupération', error));
    }
  }
}

module.exports = new AuthController();
