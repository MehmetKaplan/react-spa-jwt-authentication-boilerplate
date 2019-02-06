import React from 'react';
import {AsyncStorage} from 'react-native';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, loginComponents} from '../redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';


function mapDispatchToProps(dispatch) {
	return({
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
		this.state = {
			email_value: "",
			password_value: "",
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
				AsyncStorage.setItem(config.JWTKey, p_resp.JWT)
					.then(() => {
						this.props.setLoginState(true);
					});
			}
			else alert(JSON.stringify(p_resp));
		}).bind(this);
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
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
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Login.login}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button light onPress={() => this.props.setAppState(loginComponents.PWDRESET1)}><Text>{config.uiTexts.Login.forgotPassword}</Text></Button>
			<Text></Text>
			<Text></Text>
			<Button light onPress={() => this.props.setAppState(loginComponents.SIGNUP1)}><Text>{config.uiTexts.Login.signUp}</Text></Button>
		</Form>;
	} 
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
