import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

function mapDispatchToProps(dispatch) {
	return ({
		setAppState: (p_new_active_component) => {
			dispatch({
				type: types.SETTINGSSCREENNAV,
				activeSettingsScreenComponent: p_new_active_component,
			})
		},
		setChangeEmail: (p_changeemail) => {dispatch({
			type: types.CHANGEEMAIL,
			changeEmail: p_changeemail
		})},

	})
};

function mapStateToProps(state) {
	return ({
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class ChangeEmail extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			newEMail_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/generateEmailOwnershipToken";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.newEMail_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result == "OK")
			{
				alert(p_resp.message);
				this.props.setChangeEmail(this.state.newEMail_value);
				this.props.setAppState(settingsScreenComponents.EMAILCHANGE2);
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
				<Label>{config.uiTexts.ChangeEmail.newEMail}</Label>
				<Input 
					value={this.state.newEMail_value} 
					onChangeText={(value) => {this.setState({newEMail_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.ChangeEmail.sendConfirmationCode}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
