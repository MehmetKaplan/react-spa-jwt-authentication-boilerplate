import React from 'react';
import {AsyncStorage} from 'react-native';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../redux-store.js';
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
		changeEmail: state.changeEmail,
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class ChangeEmailConfirm extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			confirmationCode_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here
		f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/updateEMail";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
				email: this.props.changeEmail,
				emailtoken: this.state.confirmationCode_value,
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result == "OK"){
					alert(p_resp.message);
					this.props.setAppState(settingsScreenComponents.SETTINGS);
				}
				else {
					alert(p_resp.message);
				}
			}).bind(this);
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		AsyncStorage.getItem(config.JWTKey)
			.then((l_JWT) => f_process_JWT(l_JWT));

	}

	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.ChangeEmailConfirm.confirmationCode}</Label>
				<Input 
					value={this.state.confirmationCode_value} 
					onChangeText={(value) => {this.setState({confirmationCode_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Common.submit}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmailConfirm);
