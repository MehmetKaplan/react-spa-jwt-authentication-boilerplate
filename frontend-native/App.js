import React from 'react';
import { Provider, connect } from 'react-redux';
import {store} from './redux-store.js';
import App_ from './App_.js';

import {Text} from 'react-native';

export default class App extends React.Component {
	// Just a wrapper to set redux store
	render() {
		return <Provider store={store}>
			<App_ />
		</Provider>
	}
}
