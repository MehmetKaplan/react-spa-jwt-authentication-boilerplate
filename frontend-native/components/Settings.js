import React from 'react';

import { connect } from 'react-redux';

import { Form, Button, Text } from 'native-base';

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

class Settings extends React.Component {
	render() {
		return <Form>
			<Button block info   onPress={() => this.props.setAppState(settingsScreenComponents.PWDCHANGE)}><Text> {config.uiTexts.Settings.updateData}  </Text></Button>
			<Button block danger onPress={() => this.props.setAppState(settingsScreenComponents.UPDATEDATA)}><Text> {config.uiTexts.Settings.changePwd }  </Text></Button>
			<Button block danger onPress={() => this.props.setAppState(settingsScreenComponents.EMAILCHANGE1)}><Text> {config.uiTexts.Settings.changeEmail}  </Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);


