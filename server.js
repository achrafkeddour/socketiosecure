const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files 
app.use(express.static(__dirname ));

// Array to store chat messages
let messages = [];

// Object to store user information
let users = {};

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for 'changeUsername' event
    socket.on('changeUsername', (newUsername) => {
        users[socket.id] = newUsername;
    });

    // Listen for 'chatMessage' event
    socket.on('chatMessage', (message) => {
        const username = users[socket.id] || 'Anonymous';
        const messageData = { username: username, message: message };
        messages.push(messageData);
        io.emit('chatMessage', messageData);
    });

    // Send the message history to the user who just connected
    socket.emit('messageHistory', messages);

    // Listen for disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
