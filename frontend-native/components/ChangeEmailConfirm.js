import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../redux-store.js';
import config from '../config.js';

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

		// Use this.state.confirmationCode_value and post 
		alert(this.state.confirmationCode_value);
		// this.props.setAppState(settingsScreenComponents.EMAILCHANGE2);
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
