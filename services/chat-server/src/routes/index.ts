import { Router } from 'express';

// import { router as ratingRouter } from './ratingRouter';
// router.use('/user', userRouter);

const router = Router();

router.get('/', (req, res) => {
	res.json({ msg: `Hello from socket.io chat server on port ${process.env.PORT || 5000}!` });
});

export { router };
