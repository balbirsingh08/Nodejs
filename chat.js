const express = require('express'); 
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = new Map();
const messages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Handle user joining
    socket.on('user-join', (data) => {
        const { username, avatar } = data; // destructure data from client

        users.set(socket.id, {
            id: socket.id,
            username,
            avatar,
            joinedAt: new Date()
        });

        // Send welcome message to the user
        socket.emit('message', {
            username: 'System',
            text: `Welcome to the chat, ${username}!`,
            timestamp: new Date(),
            type: 'system'
        });

        // Broadcast to all other users
        socket.broadcast.emit('message', {
            username: 'System',
            text: `${username} joined the chat`,
            timestamp: new Date(),
            type: 'system'
        });

        // Send current users list
        io.emit('users-update', Array.from(users.values()));

        // Send last 50 messages to the new user
        socket.emit('message-history', messages.slice(-50));
    });

    // Handle incoming messages
    socket.on('send-message', (data) => {
        const user = users.get(socket.id);
        if (user && data.text.trim()) {
            const message = {
                id: Date.now(),
                username: user.username,
                avatar: user.avatar || '👤',  // include avatar
                text: data.text,
                timestamp: new Date(),
                type: 'user'
            };

            // Store message (limit to last 100)
            messages.push(message);
            if (messages.length > 100) messages.shift();

            // Broadcast message
            io.emit('message', message);
        }
    });

    // Handle typing indicator
    socket.on('typing-start', () => {
        const user = users.get(socket.id);
        if (user) {
            socket.broadcast.emit('user-typing', user.username);
        }
    });

    socket.on('typing-stop', () => {
        socket.broadcast.emit('user-stop-typing');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);

            // Notify other users
            socket.broadcast.emit('message', {
                username: 'System',
                text: `${user.username} left the chat`,
                timestamp: new Date(),
                type: 'system'
            });

            // Update users list
            io.emit('users-update', Array.from(users.values()));
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Chat server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
});
