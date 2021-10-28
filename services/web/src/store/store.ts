import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';

// import chatReducer from './reducers/chatSlice';

const rootReducer = combineReducers({
	// chatReducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
