// sockets/index.js
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected at ', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        // Ajoutez d'autres événements WebSocket ici
        socket.on('message', (data) => {
            console.log('Message received:', data);
            io.emit('message', data); // Broadcast le message à tous les clients connectés
        });
    });
};
