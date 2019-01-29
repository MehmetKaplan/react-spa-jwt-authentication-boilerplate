import React from 'react';
import {
	ScrollView, 
	StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

import {types, settingsScreenComponents} from '../redux-store.js';
import Settings from '../components/Settings.js';
import ChangePassword from '../components/ChangePassword.js';
import UpdateData from '../components/UpdateData.js';
import ChangeEmailConfirm from '../components/ChangeEmailConfirm.js';
import ChangeEmail from '../components/ChangeEmail.js';
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

class SettingsScreen extends React.Component {
	static navigationOptions = {
		title: config.uiTexts.SettingsScreen.title,
	};

	componentDidMount(){
		// redux root level data update test
		/*
			var i = 0;
			setInterval(() => {
				i += 1; if (i > 4) i = 0;
				this.props.setAppState(Object.values(settingsScreenComponents)[i]);
			}, 1000);
		*/
	}

	render() {
		var l_active_component;
		switch (this.props.activeSettingsScreenComponent) {
			case (settingsScreenComponents.SETTINGS):
				l_active_component = <Settings />;
				break;
			case (settingsScreenComponents.PWDCHANGE):
				l_active_component = <ChangePassword />;
				break;
			case (settingsScreenComponents.UPDATEDATA):
				l_active_component = <UpdateData />;
				break;
			case (settingsScreenComponents.EMAILCHANGE2):
				l_active_component = <ChangeEmailConfirm />;
				break;
			case (settingsScreenComponents.EMAILCHANGE1):
				l_active_component = <ChangeEmail />;
				break;
			case (settingsScreenComponents.EMAILCHANGE2):
				l_active_component = <ChangeEmailConfirm />;
				break;
			default:
				// do nothing
		}
		return <ScrollView style={styles.container}>{l_active_component}</ScrollView>;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
