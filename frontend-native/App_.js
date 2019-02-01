import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { connect } from 'react-redux';

import { types} from './redux-store.js';

import NotLoggedScreen from './screens/NotLoggedScreen.js';


function mapDispatchToProps(dispatch) {
	return({
		setAppState: (l_logIn) => {
			let l_type = l_logIn ?  types.LOGIN : types.LOGOUT;
			dispatch({type: l_type})},
		setDevUrl: () => {
			let { manifest } = Constants;
			let api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
				? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
				: `api.example.com`;
			dispatch({
				type: types.HOSTMACHINE,
				hostMachine: api
			})
		}
	})
};

function mapStateToProps(state) {
	return({
		isLogged: state.isLogged,
	});
};

class App_ extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isLoadingComplete: false,
		};
	};

	componentDidMount(){
		// redux root level data update test
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
		this.props.setDevUrl();
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
			let l_login_page = <NotLoggedScreen />;
			let l_homescreen = <View style={styles.container}>
				{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
				<AppNavigator />
			</View>;
			let l_mainpage = this.props.isLogged ? l_homescreen : l_login_page;
			return (l_mainpage);
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

export default connect(mapStateToProps, mapDispatchToProps)(App_);