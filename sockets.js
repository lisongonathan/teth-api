const jwt = require('jsonwebtoken');
const AppController = require('./controllers/AppController');

const agentsConnected = [];

const Controller = new AppController();
let sommeRebour;

Controller.currentCagnote()
.then(solde => {
  console.log('Total somme à rebours : ', solde)

  sommeRebour = solde;
})
.catch(error => {
  console.error('Erreur recupération cagnote : ', error)
})


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');
    console.log('Current Users', agentsConnected);
    //Default event ON
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

    
    //Default event EMIT
    io.emit('allCagnotes', sommeRebour);

    //Response event ON
    socket.on('changeSomme', payload =>{
      console.log('Payload changeSomme', payload)

      io.emit('allCagnote', sommeRebour - payload)
    })

    socket.on('allNotification', payload => {
      console.log('Payload allNotification', payload)
      let news = null;

      if (payload) {
        news = Controller.notificationsUser(payload)
      }

      socket.emit('allNotification', news)
    })

    socket.on('addNotification', payload => {
      console.log('Payload addNotification', payload)
      const news = Controller.newNotifcation(payload)
      
      socket.emit('allNotification', news)
    })

    socket.on('changeNotification', payload => {
      console.log('Payload changeNotification', payload)
      const news = Controller.readNotification(...payload)

      socket.emit('allNotification', news)
    })
  });
};
