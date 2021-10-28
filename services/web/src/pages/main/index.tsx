import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';

interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	const onJoinChat = () => {
		if (!name.length) enqueueSnackbar('Name may not be blank', { variant: 'warning' });
		if (!room.length) enqueueSnackbar('Room may not be blank', { variant: 'warning' });
		history.push(`/chat?name=${name}&room=${room}`);
	};

	return (
		<div className='w-screen h-screen grid place-items-center'>
			<div className='bg-blue-400 w-80 h-1/2 rounded-3xl p-12 flex flex-col'>
				<div className='text-center text-3xl mb-4'>Join live chat now! its cool</div>
				<TextField
					className='w-full'
					required
					label='Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<div className='mb-4' />
				<TextField
					className='w-full'
					required
					label='Room'
					value={room}
					onChange={(e) => setRoom(e.target.value)}
				/>
				<div className='mb-4' />
				<Button variant='contained' className='w-1/2 self-center' onClick={() => onJoinChat()}>
					Join!
				</Button>
			</div>
		</div>
	);
};
