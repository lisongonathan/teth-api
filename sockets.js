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
    // console.log('A user connected');
    // console.log('Current Users', agentsConnected);
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
          // console.log('User authenticated and connected:', agentsConnected);
          socket.emit('authenticated', session);
        } else {
          // console.log('User already connected:', existingSession);
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
        // console.log('User disconnected:', agentsConnected[index]);
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

    socket.on('allNotification', async (payload) => {
      let news = null;

      if (payload) {
        news = await Controller.notificationsUser(payload)
      }

      socket.emit('allNotification', news)
    })

    socket.on('addNotification', async (payload) => {
      console.log('Payload addNotification', payload)
      const news = await Controller.newNotifcation(payload)
      
      socket.emit('allNotification', news)
    })

    socket.on('changeNotification', async (payload) => {
      console.log('Payload changeNotification', payload)
      const news = await Controller.readNotification(payload)
      
      socket.emit('allNotification', news)
    })

    socket.on('depositRequest', async (payload) => {
      console.log('Payload depot', payload)
      
      await Controller.appModel.updateSoldeUser(payload.solde , payload.id_user)
      await Controller.appModel.createNotification('Demande de depot effectuée, votre nouveau solde est ' + payload.solde + ' FC', payload.id_user)

      const news = await Controller.notificationsUser(payload.id_user)
      console.log(payload.solde)
      socket.emit('depositRequest', payload.solde)
      socket.emit('allNotification', news)
    })

    socket.on('newSolde', (id) => {
      console.log('Payload newSolde id_user : ', id)
      Controller.appModel.readUserById(id)
      .then(infoUser => {
        console.log('Data',  infoUser)
        socket.emit('newSolde', infoUser?.data?.solde)
        
      })
      .catch(error => {
        console.error('Error', error)
      })
    })
  });
};
