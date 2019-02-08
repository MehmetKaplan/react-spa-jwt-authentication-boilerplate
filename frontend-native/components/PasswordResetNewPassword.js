import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

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
		forgoTPwdEMailJWT: state.forgoTPwdEMailJWT,
	});
};

class PasswordResetNewPassword extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			confirmationCode_value: "",
			newPassword_value: "",
			newPassword2_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/resetPwd";
		let l_extra_headers = {
			'Authorization': 'Bearer ' + this.props.forgoTPwdEMailJWT, 
		};
		let l_body = {
			saved_token: this.state.confirmationCode_value,
			password: this.state.newPassword_value,
			password2: this.state.newPassword2_value,
		};
		let l_fnc =  ((p_resp) => {
			alert(p_resp.message);
		}).bind(this);
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.PasswordResetNewPassword.confirmationCode}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.confirmationCode_value}
					onChangeText={(value) => { this.setState({ confirmationCode_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.PasswordResetNewPassword.newPassword}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.newPassword_value}
					onChangeText={(value) => { this.setState({ newPassword_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.PasswordResetNewPassword.newPassword2}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.newPassword2_value}
					onChangeText={(value) => { this.setState({ newPassword2_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.PasswordResetNewPassword.resetPassword}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(loginComponents.LOGIN)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetNewPassword);
