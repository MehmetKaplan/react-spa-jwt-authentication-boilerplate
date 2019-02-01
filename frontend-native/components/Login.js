import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, loginComponents} from '../redux-store.js';
import config from '../common-logic/config.js';
import {fetch_add_params, fetch_data_generic} from '../common-logic/fetchhandler.js';


function mapDispatchToProps(dispatch) {
	return({
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
		})},
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

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		alert(
			"\n this.state.email_value:" + this.state.email_value
			+ "\n this.state.password_value:" + this.state.password_value
		);
		let l_params_as_json = {};
		let l_uri = "http://172.20.10.12:8000";
		let l_function_to_execute_with_result_json = function (p_call_result_as_json2) {
			alert(p_call_result_as_json2.toString());
		}.bind(this);
		fetch_data_generic(l_function_to_execute_with_result_json, l_uri, 'GET', l_params_as_json, 'CROSS', '');

		//this.props.setAppState(loginComponents.LOGIN);
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
