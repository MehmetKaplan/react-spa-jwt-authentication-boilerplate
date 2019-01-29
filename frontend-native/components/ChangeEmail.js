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

class ChangeEmail extends React.Component {
	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.ChangeEmail.eMail}</Label>
				<Input />
			</Item>
			<Text></Text>
			<Button block danger><Text> {config.uiTexts.ChangeEmail.sendConfirmationCode}  </Text></Button>
			<Text></Text>
			<Button block dark onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
