// Node server which will handle socket io connection

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

const users = {};

io.on('connection', (socket) => {
	socket.on('new-user-joined', (name) => {
		users[socket.id] = name;
		socket.broadcast.emit('user-joined', name);
	});

	socket.on('send', (message) => {
		socket.broadcast.emit('receive', {
			message: message,
			user: users[socket.id],
		});
	});

	socket.on('disconnect', (message) => {
		socket.broadcast.emit('left', users[socket.id]);
		delete users[socket.id];
	});
});

server.listen(3000, () => {
	console.log(`Server running on Port 3000`);
});
