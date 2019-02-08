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
		setForgoTPwdEMailJWT: (p_forgoTPwdEMailJWT) => {dispatch({
			type: types.FORGOTPWDEMAILJWT,
			forgoTPwdEMailJWT: p_forgoTPwdEMailJWT
		})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class PasswordResetEMail extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			email_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/generateResetPwdToken";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result == "OK")
			{
				alert(JSON.stringify(p_resp));
				this.props.setForgoTPwdEMailJWT(p_resp.resetPwdJWT);
				this.props.setAppState(loginComponents.PWDRESET2);
			}
			else
			{
				alert(p_resp.message);
			}
		}).bind(this);
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	render() {
		return <Form>
		<Text></Text>
		<Text></Text>
		<Text></Text>
		<Item floatingLabel>
			<Label>{config.uiTexts.PasswordResetEMail.email}</Label>
			<Input
				value={this.state.email_value}
				onChangeText={(value) => { this.setState({ email_value: value }) }}
			/>
		</Item>
		<Text></Text>
		<Text></Text>
		<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.PasswordResetEMail.sendConfirmation}  </Text></Button>
		<Text></Text>
		<Text></Text>
		<Button block success onPress={() => this.props.setAppState(loginComponents.LOGIN)}><Text>{config.uiTexts.Common.back}</Text></Button>
	</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetEMail);
