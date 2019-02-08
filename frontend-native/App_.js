import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { connect } from 'react-redux';

import { types} from './common-logic/redux-store.js';

import NotLoggedScreen from './screens/NotLoggedScreen.js';

import config from './common-logic/config.js';

import {fetch_data_v2} from './common-logic/fetchhandler.js';

import CustomSpinner from './components/CustomSpinner.js';
import {nvl} from './common-logic/generic_library.js';

function mapDispatchToProps(dispatch) {
	return({
		setLoginState: (l_logIn) => {
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
			JWTState: "checking",
		};
	};

	componentDidMount(){
		this.setState({JWTState: "checking"});
		f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/checkJWT";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
			};
			let l_fnc =  ((p_resp) => {
				this.setState({JWTState: "checked"});
				if (p_resp.result == "OK"){
					this.props.setLoginState(true);
				}
				else {
					this.props.setLoginState(false);
					alert(p_resp.message);
				}
			}).bind(this);
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		AsyncStorage.getItem(config.JWTKey)
			.then((l_JWT) => f_process_JWT(l_JWT));
		this.props.setDevUrl();
	}


	render() {
		if (this.state.JWTState == "ckecking")return <CustomSpinner />;

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
