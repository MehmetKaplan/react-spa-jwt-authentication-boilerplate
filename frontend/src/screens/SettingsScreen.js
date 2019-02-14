import React from 'react';

import { connect } from 'react-redux';

import {types, settingsScreenComponents} from '../common-logic/redux-store.js';
import Settings from '../components/Settings.js';
import ChangePassword from '../components/ChangePassword.js';
import UpdateData from '../components/UpdateData.js';
import ChangeEmailConfirm from '../components/ChangeEmailConfirm.js';
import ChangeEmail from '../components/ChangeEmail.js';
import Logout from '../components/Logout.js';
//import config from '../common-logic/config.js';

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

	componentDidMount(){
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
			case (settingsScreenComponents.LOGOUT):
				l_active_component = <Logout />;
				break;
			default:
				l_active_component = <Settings />;
				break;
	}
		return <React.Fragment>{l_active_component}</React.Fragment>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
