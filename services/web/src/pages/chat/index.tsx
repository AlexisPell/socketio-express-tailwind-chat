import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import io, { Socket } from 'socket.io-client';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';

let socket: Socket;
const backUrl = 'localhost:5000';

interface Message {
	user: string;
	text: string;
}

interface ChatPageProps {}
export const ChatPage: React.FC<ChatPageProps> = ({}) => {
	const location = useLocation();

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);

	// ON JOIN UE
	useEffect(() => {
		const { name, room } = queryString.parse(location.search);

		socket = io(backUrl);
		console.log('🚀 ~ file: index.tsx ~ line 21 ~ useEffect ~ socket', socket);

		setName(name as string);
		setRoom(room as string);

		socket.emit('join-chat', { name, room }, (info: string) => {
			console.log('RECEIVED CB: ', info);
		});

		return () => {
			socket.emit('disconnect');

			socket.off();
		};
	}, [location.search]);

	// SEND MESSAGE UE
	useEffect(() => {
		socket.on('message', (msg: Message) => {
			setMessages([...messages, msg]);
		});
	}, [messages]);

	const sendMessage = (e: React.KeyboardEvent, msg: string) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			socket.emit('send-message', msg, () => setMessage(''));
		}
	};

	console.log('MESSAGES', message, messages);

	return (
		<div className='w-screen h-screen bg-gray-800 flex flex-col'>
			<header className='bg-gray-500 text-center text-gray-800 text-2xl py-2 h-auto max-h-24 rounded-b-md'>
				Welcome to <strong>{room}</strong> room
			</header>
			<main className='mb-auto'>
				{messages.map((msg) => (
					<div className='m-4 p-2 bg-blue-200 rounded-lg'>
						<strong>{msg.user}</strong>: {msg.text}
					</div>
				))}
			</main>
			<TextField
				className='mt-auto w-full bg-gray-500 rounded-t-md text-2xl'
				color='secondary'
				InputProps={{
					endAdornment: <SendIcon />,
				}}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyPress={(e) => sendMessage(e, message)}
			/>
		</div>
	);
};
