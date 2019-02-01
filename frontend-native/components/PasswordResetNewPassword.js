import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, loginComponents} from '../redux-store.js';
import config from '../common-logic/config.js';

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
		alert(
			"\n this.state.confirmationCode_value:" + this.state.confirmationCode_value
			+ "\n this.state.newPassword_value:" + this.state.newPassword_value
			+ "\n this.state.newPassword2_value:" + this.state.newPassword2_value
		 );
		this.props.setAppState(loginComponents.PWDRESET2);
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
