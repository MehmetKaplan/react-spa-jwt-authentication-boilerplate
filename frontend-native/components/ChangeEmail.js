import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../redux-store.js';
import config from '../common-logic/config.js';

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

		// use this.state.newEMail_value to send the confirmation code
		this.props.setAppState(settingsScreenComponents.EMAILCHANGE2);
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
