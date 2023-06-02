// Node server which will handle socket io connection

const io = require('socket.io')(3000, { origin: '*' });

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
