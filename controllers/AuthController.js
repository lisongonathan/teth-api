const BaseController = require('./Controller');
const AuthModel = require('../models/AuthModel');
const path = require('path');
const nodemailer = require('nodemailer');
const { error, info } = require('console');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class AuthController extends BaseController {
  constructor() {
    super();
    this.authModel = new AuthModel()

    // Configuration de Nodemailer avec vos informations SMTP
    this.transporter = nodemailer.createTransport({
        host: 'smtp-teth.alwaysdata.net', // Votre serveur SMTP
        port: 587, // Port SMTP (utilisez 465 pour SSL, 587 pour STARTTLS)
        secure: false, // true pour le port 465, false pour d'autres ports
        auth: {
            user: 'teth@alwaysdata.net', // Votre adresse e-mail
            pass: 'P@sse2mot', // Votre mot de passe (ou mot de passe d'application)
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

  // async cryptPassword(password){
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(password);
  //   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));
  //   const hashHex = hashArray.map(
  //       b => b.toString(16).padStart(2, '0')
  //   )
  //   .join('');
  //   return hashHex;


  // }

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
    const { matricule, password } = req.body;
    const mdp = await this.cryptPassword(password)
    console.log("Crypt mdp :", mdp)

    try {
      const result = await this.authModel.getUserByMatricule(matricule, mdp);

      if (result.data.length) {
        const user = { id: result.data[0].id, matricule: matricule };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ status: 200, message: 'Succès', data: result.data, token: token });

      } else {
        return res.status(404).json({ status: 404, message: 'Non trouvé' });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Erreur serveur', error });
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
      console.log(user)
      if (user.data.length) {
        // Envoyer un e-mail de récupération ou autre logique
        res.json(this.sendResponse(res, 200, 'Un mot de passe de récupération sera envoyé à votre addrese mail', user));
      } else {
        res.json(this.sendResponse(res, 404, 'Utilisateur non trouvé', user));
      }
    } catch (error) {
      res.json(this.sendResponse(res, 500, 'Erreur de récupération', error));
    }
  }

  async sendPassword(req, res) {
    const { user } = req.body;

    const password = this.generateRandomString(6);
    
    const mailOptions = {
      from: 'teth@alwaysdata.net', // Votre adresse e-mail
      to: user.e_mail, // Adresse e-mail du destinataire
      subject: "Récupération du compte", // Sujet de l'e-mail
      text: `Salut ${user.matricule} !! Votre nouveau mot de passe est : ${password}`, // Corps de l'e-mail
    };

    this.transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ msg: 'Erreur lors de l\'envoi de l\'e-mail', error })
      } 

     
    // Utilisation de la fonction pour chiffrer un mot de passe
    this.cryptPassword(password)
      .then(async cryptPassword => {
        try {
          const response = await this.authModel.setPasswordUser(cryptPassword, user.id);
          console.log(response)
          if (response.data) {
            // Envoyer un e-mail de récupération ou autre logique
            res.json(this.sendResponse(res, 200, 'Oération reussit, vérifier dans votre boite de reception', response));
          } else {
            res.json(this.sendResponse(res, 404, 'Problème pendant le traitement', response));
          }
        } catch (error) {
          res.json(this.sendResponse(res, 500, 'Erreur inattendu', error));
        }

      })
      .catch(error => console.error('Erreur lors du hachage:', error));
    })
  }

  async testApi (req, res){
    this.sendResponse(res, 200, 'Data request', {test : req});
  }


}

module.exports = AuthController;
