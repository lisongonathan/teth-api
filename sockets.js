const jwt = require('jsonwebtoken');

const agentsConnected = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');
    console.log('Current Users', agentsConnected);

    socket.on('authenticate', (token) => {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier si le token a expiré
        const currentTime = Math.floor(Date.now() / 1000);
        if (user.exp < currentTime) {
          console.log('Token expired');
          socket.emit('token_expired');
          socket.disconnect();
          return;
        }

        // Vérifier si l'utilisateur est déjà connecté
        const existingSession = agentsConnected.find(agent => agent.user === user.id);
        if (!existingSession) {
          const session = {
            socketId: socket.id,
            user: user.id,
            dateConnected: new Date().toISOString(),
            pseudo: user.matricule
          };
          agentsConnected.push(session);
          console.log('User authenticated and connected:', agentsConnected);
          socket.emit('authenticated', session);
        } else {
          console.log('User already connected:', existingSession);
          socket.emit('already_connected', existingSession);
        }
      } catch (error) {
        console.log('Authentication error:', error);
        socket.emit('unauthorized', error);
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      const index = agentsConnected.findIndex(agent => agent.socketId === socket.id);
      if (index !== -1) {
        console.log('User disconnected:', agentsConnected[index]);
        agentsConnected.splice(index, 1);
      }
    });
  });
};
