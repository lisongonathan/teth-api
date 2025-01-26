require('dotenv').config(); // Chargement des variables d'environnement

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

// Array to store request logs
const requests = [];

// Middleware to log the IP and endpoint of the request
app.use((req, res, next) => {
    const ip = req.ip;
    const endpoint = req.originalUrl;
    const time = new Date().toISOString();

    // Find the existing record for the IP
    let requestLog = requests.find(r => r.ip === ip);
    if (!requestLog) {
        requestLog = { ip: ip, endpoints: [] };
        requests.push(requestLog);
    }

    // Add the new endpoint log
    requestLog.endpoints.push({ time: time, endpoint: endpoint });

    // Print the requests array to the console
    console.log(JSON.stringify(requests, null, 2));

    next();
});

// Port d'écoute du serveur
const port = process.env.PORT || 8000;

// Middleware pour analyser le corps des requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour servir les fichiers statiques (si nécessaire)
app.use(express.static(path.join(__dirname, './public')));

// Servir des fichiers statiques depuis le dossier 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Utiliser le routeur principal pour toutes les routes
const routes = require('./routes');
app.use(routes);

// Gestion des connexions WebSocket
require('./sockets')(io);

// Démarrage du serveur
http.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
