class Controller {
    constructor(model) {
      this.model = model; // Composition : le contrôleur utilise le modèle principal
    }
    
    /**
     * Méthode pour envoyer une réponse standardisée de l'API.
     * 
     * @param {Object} res - L'objet de réponse Express.
     * @param {Number} status - Le code de statut HTTP (200, 404, 500, etc.).
     * @param {String} msg - Un message descriptif pour l'utilisateur.
     * @param {Object} data - Les données à retourner dans la réponse (peut être null).
     */
    sendResponse(res, status, msg, data = null) {
        res.status(status).json({
        status: status,
        msg: msg,
        data: data
        });
    }
  }
  
  module.exports = Controller;
  