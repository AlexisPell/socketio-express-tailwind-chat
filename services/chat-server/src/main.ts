import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { connect } from 'mongoose';

import { router } from './routes';
import { User, UserDocument } from './enitites/user';

async function bootstrap() {
	await connect('mongodb://localhost:27017/chat-service')
		.then((_) => console.log(`MONGODB CONNECTED`))
		.catch(() => console.log(`MONGODB FAILED TO CONNECT. Chat service.`));

	const app = express();
	const server = http.createServer(app);
	const io = new Server(server, {
		cors: { origin: '*' },
	});

	const port = process.env.PORT || 5000;

	app.use(cors());
	app.use(express.json());

	app.use('/', router);

	io.on('connection', (socket) => {
		console.log('a new user connected', socket.data, socket.id);

		// JOIN CHAT
		socket.on('join-chat', async ({ name, room }, callback) => {
			let user;
			// new user
			const potentialUser = await User.findOne({ name, room });
			if (potentialUser) {
				user = await User.findOneAndUpdate({ name, room }, { $set: { socketId: socket.id } });
				callback('Existing user comes in chat');
			}

			// existing user
			if (!potentialUser) {
				user = await User.create({
					socketId: socket.id,
					name,
					room,
				});
				callback('New user joins chat');
			}
			if (!user) throw new Error('USER IS NOT CREATED');

			// broadcasting
			socket.broadcast
				.to(user.room)
				.emit('message', { user: 'Telegrach', text: `${user.name} joined a chat` });

			socket.join(user.room);

			callback();
		});

		// SEND MESSAGE
		socket.on('send-message', async (message, callback) => {
			const user = await User.findOne({ socketId: socket.id });
			if (!user) return callback(`User not found in socket session`);

			io.to(user.room).emit('message', { user: user.name, text: message });

			callback();
		});

		// CLOSE CONNECTION
		socket.on('disconnect', () => {
			console.log('User had left.');
		});
	});

	server.listen(port, () => {
		console.log('listening on *:5000');
	});
}
bootstrap();
