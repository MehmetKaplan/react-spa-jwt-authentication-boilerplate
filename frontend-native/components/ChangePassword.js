import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {nvl} from '../common-logic/generic_library.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

function mapDispatchToProps(dispatch) {
	return ({
		setAppState: (p_new_active_component) => {
			dispatch({
				type: types.SETTINGSSCREENNAV,
				activeSettingsScreenComponent: p_new_active_component,
			})
		},
	})
};

function mapStateToProps(state) {
	return ({
		JWT: state.JWT,
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class ChangePassword extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			newPassword_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/updatePassword";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
				oldPassword: this.state.oldPassword_value,
				password: this.state.newPassword_value,
				password2: this.state.newPassword2_value,
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result == "OK"){
					alert(p_resp.message);
				}
				else {
					alert(p_resp.message);
				}
			}).bind(this);
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		};
		f_process_JWT(this.props.JWT);
	}
	

	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.ChangePassword.oldPassword}</Label>
				<Input 
					secureTextEntry={true}
					value={this.state.oldPassword_value}
					onChangeText={(value) => {this.setState({oldPassword_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.ChangePassword.newPassword}</Label>
				<Input 
					secureTextEntry={true}
					value={this.state.newPassword_value}
					onChangeText={(value) => {this.setState({newPassword_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.ChangePassword.newPassword2}</Label>
				<Input 
					secureTextEntry={true}
					value={this.state.newPassword2_value}
					onChangeText={(value) => {this.setState({newPassword2_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.ChangePassword.changePassword}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
