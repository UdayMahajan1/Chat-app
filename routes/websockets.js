const { Server } = require('socket.io');
const ejs = require('ejs');
const path = require('path');

function createWebSocketServer(server) {

    const socketUsernameMap = new Map();
    
    const io = new Server(server);
    
    io.on('connection', (socket) => {

        var username = socket.handshake.query.username;
        const roomName = socket.handshake.query.roomName;

        socketUsernameMap.set(socket.id, username);

        socket.join(roomName);
        
        socket.broadcast.to(roomName).emit('Welcome', 'A new just joined the room !');

        var roomSockets = io.sockets.adapter.rooms.get(roomName);

        let userList = [];

        console.log(roomSockets);
        roomSockets.forEach((roomSocket) => {
            var user = socketUsernameMap.get(roomSocket);
            if(user !== undefined) {
                userList.push(`<li class="list-group-item">${user}</li>`);
            } else {}
        });

        io.to(roomName).emit('Online Users', userList);

        socket.on('chat message', async function (message) {

            var aligner = "left";
            var renderedChat = await ejs.renderFile(path.join(__dirname + '/../' + 'views/' + 'chatbox.ejs'), { message: message, username: username, aligner: aligner });
            const html = renderedChat.toString();
            socket.broadcast.to(roomName).emit('chat message', renderedChat);
            aligner = "right";
            username = "You";
            renderedChat = await ejs.renderFile(path.join(__dirname + '/../' + 'views/' + 'chatbox.ejs'), { message: message, username: username, aligner: aligner });
            io.to(socket.id).emit('chat message', renderedChat);

        });

        socket.on('is typing', () => {
            username = socket.handshake.query.username;
            socket.broadcast.to(roomName).emit('is typing', username);
        });

        socket.on('done typing', () => {
            socket.broadcast.to(roomName).emit('done typing');
        });

        socket.on('log out request', () => {
            socket.disconnect();
            console.log(`${socket.id} has disconnected`, roomSockets);
        });
    });

    return io;
}

module.exports = createWebSocketServer;
