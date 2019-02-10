import React from 'react';
import { Provider } from 'react-redux';
import {store} from './common-logic/redux-store.js';
import App_ from './App_.js';


export default class App extends React.Component {
	// Just a wrapper to set redux store
	componentDidMount(){
		// redux root level data update test >>> MOVED FROM App_.js
		/*
			setInterval(() => {
				let l_type = store.getState().isLogged ? types.LOGOUT : types.LOGIN;
				store.dispatch({type: l_type});
				this.setState({logStateOfApp: store.getState().isLogged});
			}, 10000);
		*/
		/*
			var i = 0;
			setInterval(() => {
			i += 1; if (i > 4) i = 0;
			store.dispatch({
					type: types.LOGINNAV,
					activeLoginComponent: Object.values(loginComponents)[i]
				})
			}, 1000);
		*/

	}
	render() {
		/* eslint-disable react/jsx-pascal-case */
		return <Provider store={store}>
			<App_ /> 
		</Provider>;
		/* eslint-enable react/jsx-pascal-case */
	}
}
