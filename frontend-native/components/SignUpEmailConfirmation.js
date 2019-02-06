import React from 'react';

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
		setSignUpEmail: (p_signupemail) => {dispatch({
			type: types.SIGNUPEMAIL,
			signUpEmail: p_signupemail
		})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class SignUpEmailConfirmation extends React.Component {

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
		let l_uri = config.mainServerBaseURL + "/generateEmailOwnershipToken";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result == "OK")
			{
				alert(JSON.stringify(p_resp));
				this.props.setSignUpEmail(this.state.email_value);
				this.props.setAppState(loginComponents.SIGNUP2);
			}
			else {
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
				<Label>{config.uiTexts.SignUpEmailConfirmation.email}</Label>
				<Input
					value={this.state.email_value}
					onChangeText={(value) => { this.setState({ email_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.SignUpEmailConfirmation.sendConfirmation}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(loginComponents.LOGIN)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpEmailConfirmation);
