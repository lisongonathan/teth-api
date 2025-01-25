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
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async login(req, res) {
    const { matricule, password } = req.body;
    const hashedPassword = await this.cryptPassword(password);

    try {
      const result = await this.authModel.readAgentByAuth(matricule, hashedPassword);

      if (result.data.length) {
        const user = { id: result.data[0].id, matricule: matricule };
        const token = this.createToken(user);
        return res.json({ status: 200, message: 'Succès', data: result.data, token: token });
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
      if (user.data.length) {
        const password = this.generateRandomString(6);
        const message = `Salut ${user.data[0].matricule} !! Votre nouveau mot de passe est : ${password}`;
        await this.sendNotification(user.data[0].e_mail, message);
        
        const hashedPassword = await this.cryptPassword(password);
        await this.authModel.updateAgentPassword(hashedPassword, user.data[0].id);
        
        res.json(200, 'Un mot de passe de récupération sera envoyé à votre adresse mail', {});
      } else {
        res.json(404, 'Utilisateur non trouvé', user);
      }
    } catch (error) {
      res.json(500, 'Erreur de récupération', error);
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
}

module.exports = AuthController;
