import React from 'react';
import {AsyncStorage, Platform} from 'react-native';

import { Facebook } from 'expo';
import { Google } from 'expo';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text, CheckBox, View, Icon } from 'native-base';

import {types, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';


function mapDispatchToProps(dispatch) {
	return({
		setJWT: (l_JWT) => {
			dispatch({
				type: types.JWT,
				JWT: l_JWT
			})
		},
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
		})},
		setLoginState: (l_logIn) => {
			let l_type = l_logIn ?  types.LOGIN : types.LOGOUT;
			dispatch({type: l_type})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class Login extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.FBLogIn = this.FBLogIn.bind(this);
		this.GoogleLogIn = this.GoogleLogIn.bind(this);
		this.state = {
			email_value: "",
			password_value: "",
			remember_me: false,
		};
	}

	componentDidMount(){
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/login";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
			password: this.state.password_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result == "OK"){
				this.props.setJWT(p_resp.JWT);
				this.props.setLoginState(true);
				if (this.state.remember_me) AsyncStorage.setItem(config.JWTKey, p_resp.JWT);
			}
			else alert(JSON.stringify(p_resp));
		}).bind(this);
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	async FBLogIn() {
		try {
			let {
				type,
				token,
				expires,
				permissions,
				declinedPermissions,
			} = await Facebook.logInWithReadPermissionsAsync(config.FacebookAppID, {
				permissions: ['public_profile', 'email'],
				behavior: 'web',
			});
			if (type === 'success') {
				let l_method = "POST";
				let l_uri = config.mainServerBaseURL + "/loginViaSocial";
				let l_extra_headers = {};
				let l_body = {
					socialsite: config.signalsFrontendBackend.socialSites.facebook,
					token: token,
				};
				let l_fnc =  ((p_resp) => {
					if (p_resp.result == "OK"){
						this.props.setJWT(p_resp.JWT);
						this.props.setLoginState(true);
						if (this.state.remember_me) AsyncStorage.setItem(config.JWTKey, p_resp.JWT);
					}
					else alert(JSON.stringify(p_resp));
				}).bind(this);
				fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
			};
		}
		catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
		}
	}

	async GoogleLogIn(){
		try{
			const { type, accessToken } = await Google.logInAsync({ 
				clientId: (Platform.OS === 'android') ? config.GoogleClientIdAndroid : config.GoogleClientIdIOS,
				scopes: ['profile', 'email'],
			});
			if (type === 'success') {
				let l_method = "POST";
				let l_uri = config.mainServerBaseURL + "/loginViaSocial";
				let l_extra_headers = {};
				let l_body = {
					socialsite: config.signalsFrontendBackend.socialSites.google,
					token: accessToken,
				};
				let l_fnc =  ((p_resp) => {
					if (p_resp.result == "OK"){
						this.props.setJWT(p_resp.JWT);
						this.props.setLoginState(true);
						if (this.state.remember_me) AsyncStorage.setItem(config.JWTKey, p_resp.JWT);
					}
					else alert(JSON.stringify(p_resp));
				}).bind(this);
				fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
			};
		}
		catch ({ message }) {
			alert(`Google Login Error: ${message}`);
		}


	}

	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.Login.email}</Label>
				<Input
					value={this.state.email_value}
					onChangeText={(value) => { this.setState({ email_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.Login.password}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.password_value}
					onChangeText={(value) => { this.setState({ password_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<View style={{flexDirection: 'row'}}>
				<CheckBox checked={this.state.remember_me} color="red" onPress={()=>{
					let l_new_state = !(this.state.remember_me);
					this.setState({remember_me: l_new_state});
				}}/>
				<Text>{"     " + config.uiTexts.Login.rememberMe}</Text>
			</View>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Login.login}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block light onPress={() => this.props.setAppState(loginComponents.PWDRESET1)}><Text>{config.uiTexts.Login.forgotPassword}</Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block light onPress={() => this.props.setAppState(loginComponents.SIGNUP1)}><Text>{config.uiTexts.Login.signUp}</Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block light onPress={this.FBLogIn}><Icon name="logo-facebook" /><Text>{config.uiTexts.Login.FacebookLogin}</Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block light onPress={this.GoogleLogIn}><Icon name="logo-google" /><Text>{config.uiTexts.Login.GoogleLogin}</Text></Button>
		</Form>;
	} 
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
