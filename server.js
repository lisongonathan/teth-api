require('dotenv').config(); // Chargement des variables d'environnement

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/* 
    Déclarations
*/

// Port d'écoute du serveur
const port = process.env.PORT || 8000;

// Middleware pour analyser le corps des requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour servir les fichiers statiques (si nécessaire)
app.use(express.static(path.join(__dirname, './public')));

// Utiliser le routeur principal pour toutes les routes
const routes = require('./routes');
app.use(routes);

// Gestion des connexions WebSocket
require('./sockets')(io);

// Démarrage du serveur
http.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
