import React from 'react';
import { Provider } from 'react-redux';
import {store} from './common-logic/redux-store.js';
import AppSub from './AppSub.js';

export default class App extends React.Component {
	// Just a wrapper to set redux store
	componentDidMount(){
		// redux root level data update test >>> MOVED FROM AppSub.js
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
			<AppSub /> 
		</Provider>;
		/* eslint-enable react/jsx-pascal-case */
	}
}
