import React from 'react';

import { connect } from 'react-redux';

import { Form, Button, Text } from 'native-base';

import {types, settingsScreenComponents} from '../common-logic/redux-store.js';
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

class Settings extends React.Component {
	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Button block info   onPress={() => this.props.setAppState(settingsScreenComponents.UPDATEDATA)}><Text> {config.uiTexts.Settings.updateData}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={() => this.props.setAppState(settingsScreenComponents.PWDCHANGE)}><Text> {config.uiTexts.Settings.changePwd }  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={() => this.props.setAppState(settingsScreenComponents.EMAILCHANGE1)}><Text> {config.uiTexts.Settings.changeEmail}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Button block danger onPress={() => this.props.setAppState(settingsScreenComponents.LOGOUT)}><Text> {config.uiTexts.Settings.logout}  </Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);


