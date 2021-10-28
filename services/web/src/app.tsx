import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import { setupStore } from './store/store';

import { MainPage } from './pages/main';
import { ChatPage } from './pages/chat';

const store = setupStore();

interface AppProps {}
export const App: React.FC<AppProps> = ({}) => {
	return (
		<Provider store={store}>
			<SnackbarProvider maxSnack={3}>
				<Router>
					<Route path='/' exact component={MainPage} />
					<Route path='/chat' component={ChatPage} />
				</Router>
			</SnackbarProvider>
		</Provider>
	);
};

// TODO: 45:30
