import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { Container, Header, Left, Body, Right, Title, Subtitle } from 'native-base';

import { Provider } from 'react-redux';

import { createStore } from 'redux';

// Define action types
const types = {
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	HOMESCREENRED: 'RED',
	HOMESCREENBLUE: 'BLUE',
};

// Define a reducer
const reducer = (p_state, p_action) => {
	let l_retval = Object.assign({}, p_state); // do not mutate p_state
	switch (p_action.type) {
		case types.LOGIN:
			l_retval['isLogged'] = true;
			break;
		case types.LOGOUT:
			l_retval['isLogged'] = false;
			break;
		case types.HOMESCREENRED:
			l_retval['homeScreenColor'] = 'red';
			break;
		case types.HOMESCREENBLUE:
			l_retval['homeScreenColor'] = 'blue';
			break;
		default:
			// do nothing
	}
	return l_retval;
};

// Define the initial state of our store
const initialState = { 
	isLogged: false,
	homeScreenColor: 'red',
};

// Create a store, passing our reducer function and our initial state
const store = createStore(reducer, initialState);

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isLoadingComplete: false,
			logStateOfApp: true,
		};
	};

	componentDidMount(){
		/*
			// redux root level data update test
			setInterval(() => {
				let l_type = store.getState().isLogged ? types.LOGOUT : types.LOGIN;
				store.dispatch({type: l_type});
				this.setState({logStateOfApp: store.getState().isLogged});
			}, 10000);
		*/
	}

	render() {
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			let l_login_page = <View style={styles.container}>
				<Container>
					<Header>
						<Left />
						<Body>
							<Title>App Log State</Title>
							<Subtitle>{this.state.logStateOfApp.toString()}</Subtitle>
						</Body>
						<Right />
					</Header>
				</Container>
			</View>;
			let l_homescreen = <View style={styles.container}>
				{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
				<AppNavigator />
			</View>;
			let l_mainpage = this.state.logStateOfApp ? l_homescreen : l_login_page;
			return (
				<Provider store={store}>
					{l_mainpage}
				</Provider>
			);
		}
	}

	_loadResourcesAsync = async () => {
		return Promise.all([
			Asset.loadAsync([
				require('./assets/images/robot-dev.png'),
				require('./assets/images/robot-prod.png'),
			]),
			Font.loadAsync({
				// This is the font that we are using for our tab bar
				...Icon.Ionicons.font,
				// We include SpaceMono because we use it in HomeScreen.js. Feel free
				// to remove this if you are not using it in your app
				'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
			}),
		]);
	};

	_handleLoadingError = error => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});

export default (App);

