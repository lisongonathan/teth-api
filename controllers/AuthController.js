const BaseController = require('./Controller');
const AuthModel = require('../models/AuthModel');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class AuthController extends BaseController {
  constructor() {
    super();
    this.authModel = new AuthModel();

    this.transporter = nodemailer.createTransport({
      host: 'smtp-teth.alwaysdata.net',
      port: 587,
      secure: false,
      auth: {
        user: 'teth@alwaysdata.net',
        pass: 'P@sse2mot',
      },
    });
  }


  async hello(req, res) {
    const payload = { id: 1, name: "John Doe" }; // Exemple de données
    const secret = process.env.JWT_SECRET; // Assure-toi que c'est bien défini
    const options = { expiresIn: "1h" }; // Le token expire dans 1 heure

    try {
      const token = jwt.sign(payload, secret, options);
      res.json({ success: true, token });
    } catch (err) {
      console.error("Erreur lors de la génération du token :", err.message);
      res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
    // res.json({status:200, message:'Bienvenu', data:'Teth vous dit Bonjour!!!'});
  }

  generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  async cryptPassword(password) {
    return new Promise((resolve, reject) => {
      try {
        const hash = crypto.createHash('sha256').update(password, 'utf-8').digest('hex');
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    });
  }

  createToken(user) {
    const payload = user; // Exemple de données
    const secret = process.env.JWT_SECRET; // Assure-toi que c'est bien défini
    const options = { expiresIn: "1h" }; // Le token expire dans 1 heure

    try {
      const token = jwt.sign(payload, secret, options);
      return token;
      
    } catch (err) {
      console.error("Erreur lors de la génération du token :", err.message);
      return { success: false, message: "Erreur interne du serveur" };
    }
  }

  async login(req, res) {
    const { matricule, password } = req.body;
    const hashedPassword = await this.cryptPassword(password);

    try {
      const result = await this.authModel.readAgentByAuth(matricule, hashedPassword);
      if (result.data.length) {
        const user = { id: result.data[0].id, matricule: matricule };
        const token = this.createToken(user);
        console.log("Token generation", token)
        
        return res.json({ status: 200, message: 'Succès', data: result.data, token: token });
      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async signin(req, res) {
    const { matricule, password } = req.body;
    const hashedPassword = await this.cryptPassword(password);

    try {
      const result = await this.authModel.readUserByAuth(matricule, hashedPassword);
      if (result.data.length) {
        const user = { id: result.data[0].id, matricule: matricule };
        const token = this.createToken(user);
        console.log("Token generation", token)
        
        return res.json({ status: 200, message: 'Succès', data: result.data, token: token });
      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async signup(req, res) {
    const { pseudo, e_mail, mdp } = req.body;
    const hashedPassword = await this.cryptPassword(mdp);

    try {
      // Check if pseudo already exists
      const pseudoCheck = await this.authModel.checkPseudoUser(pseudo);
      if (pseudoCheck.data.length) {
        return res.status(400).json({ status: 400, message: 'Pseudo already exists' });
      }

      // Check if email already exists
      const emailCheck = await this.authModel.checkMailUser(e_mail);
      if (emailCheck.data.length) {
        return res.status(400).json({ status: 400, message: 'Email already exists' });
      }

      // Create new user
      const result = await this.authModel.createUser(pseudo, e_mail, hashedPassword);
      console.log(result);
      if (result) {
        // Create level of user
        await this.authModel.createLevelUser(result.data.insertId);
        await this .authModel.createNotification("Teth vous souhaite la bienvenu en vous offrant 3 parties", result.data.insertId)
        
        return res.json({ status: 200, message: 'Succès', data: result.data.insertId });
      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
    }
  }

  async forget(req, res) {
    const { email } = req.body;

    try {
      const user = await this.authModel.readAgentByEmail(email);
      console.log(user)
      if (user.data.length) {
        const password = this.generateRandomString(6);
        const message = `Salut ${user.data[0].pseudo} !! Votre nouveau mot de passe est : ${password}`;
        const resultNotif = await this.sendNotification(user.data[0].e_mail, message);
        // if (resultNotif) console.log('Notification ', resultNotif);
        
        
        const hashedPassword = await this.cryptPassword(password);
        // if(hashedPassword) console.log('Mot de passe crypté', hashedPassword);

        const resultPassword = await this.authModel.updatePasswordAgent(hashedPassword, user.data[0].id);
        // if(resultPassword) console.log('Changement mot de passe', resultPassword);

        this.sendResponse(res, 200, 'Un mot de passe de récupération sera envoyé à votre adresse mail')
        
      } else {
        this.sendResponse(res, 400, 'Utilisateur non trouvé',  {email})
      }
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur de récupération', error);
    }
  }

  async recovery(req, res) {
    const { email } = req.body;

    try {
      const user = await this.authModel.checkMailUser(email);
      console.log(user)
      if (user.data.length) {
        const password = this.generateRandomString(6);
        const message = `Salut ${user.data[0].pseudo} !! Votre nouveau mot de passe est : ${password}`;
        const resultNotif = await this.sendNotification(user.data[0].e_mail, message);
        // if (resultNotif) console.log('Notification ', resultNotif);
        
        
        const hashedPassword = await this.cryptPassword(password);
        // if(hashedPassword) console.log('Mot de passe crypté', hashedPassword);

        const resultPassword = await this.authModel.updatePasswordUser(hashedPassword, user.data[0].id);
        // if(resultPassword) console.log('Changement mot de passe', resultPassword);

        this.sendResponse(res, 200, 'Un mot de passe de récupération sera envoyé à votre adresse mail')
        
      } else {
        this.sendResponse(res, 400, 'Utilisateur non trouvé',  {email})
      }
    } catch (error) {
      this.sendResponse(res, 500, 'Erreur de récupération', error);
    }
  }

  async sendNotification(recipient, message, subject = "Récupération du compte") {
    const mailOptions = {
      from: 'teth@alwaysdata.net',
      to: recipient,
      subject: subject,
      text: message,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  async checkPseudoUser(req, res) {
    const { pseudo } = req.body;
    try {
      const result = await this.authModel.checkPseudoUser(pseudo);
      if (result.data.length) {
        return res.json({ status: 200, message: 'Pseudo exists', data: result.data });
      } else {
        return res.status(404).json({ status: 404, message: 'Pseudo not found' });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Server error', error });
    }
  }

  async checkMailUser(req, res) {
    const { email } = req.body;
    try {
      const result = await this.authModel.checkMailUser(email);
      if (result.data.length) {
        return res.json({ status: 200, message: 'Email exists', data: result.data });
      } else {
        return res.status(404).json({ status: 404, message: 'Email not found' });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Server error', error });
    }
  }
}

module.exports = AuthController;
