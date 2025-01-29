require('dotenv').config(); // Chargement des variables d'environnement

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Port d'écoute du serveur
const PORT = process.env.PORT || 8000;

// Array pour stocker les logs (max 100 entrées pour éviter la surcharge mémoire)
const requests = [];
const MAX_LOG_ENTRIES = 100;

// Middleware pour journaliser les requêtes entrantes
app.use((req, res, next) => {
    const ip = req.ip;
    const endpoint = req.originalUrl;
    const time = new Date().toISOString();

    let requestLog = requests.find(r => r.ip === ip);
    if (!requestLog) {
        requestLog = { ip, endpoints: [] };
        requests.push(requestLog);
    }

    requestLog.endpoints.push({ time, endpoint });

    // Limiter la taille des logs
    if (requests.length > MAX_LOG_ENTRIES) {
        requests.shift(); // Supprimer les plus anciens logs
    }

    console.log(JSON.stringify(requests, null, 2));

    next();
});

// Middleware pour le parsing du JSON et des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, './public')));
app.use(cors());

// Chargement des routes
const routes = require('./routes');
app.use(routes);

// Gestion des connexions WebSocket
require('./sockets')(io);

// Gestion des erreurs globales pour Express
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Une erreur interne est survenue" });
});

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`✅ Serveur en écoute sur le port : ${PORT}`);
});
