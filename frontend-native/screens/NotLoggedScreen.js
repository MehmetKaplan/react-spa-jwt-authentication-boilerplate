import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { connect } from 'react-redux';

import {types, loginComponents} from '../redux-store.js';

import Subtitle from 'native-base';

import Login from '../components/Login.js';
import SignUpEmailConfirmation from '../components/SignUpEmailConfirmation.js';
import SignUpRelatedInputs from '../components/SignUpRelatedInputs.js';
import PasswordResetEMail from '../components/PasswordResetEMail.js';
import PasswordResetNewPassword from '../components/PasswordResetNewPassword.js';

function mapDispatchToProps(dispatch) {
	return({
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
		})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class NotLoggedScreen extends React.Component {
	
	render() {
		var l_active_component;
		switch (this.props.activeLoginComponent) {
			case (loginComponents.LOGIN):
				l_active_component = <Login />;
				break;
			case (loginComponents.SIGNUP1):
				l_active_component = <SignUpEmailConfirmation />;
				break;
			case (loginComponents.SIGNUP2):
				l_active_component = <SignUpRelatedInputs />;
				break;
			case (loginComponents.PWDRESET1):
				l_active_component = <PasswordResetEMail />;
				break;
			case (loginComponents.PWDRESET2):
				l_active_component = <PasswordResetNewPassword />;
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
 
 export default connect(mapStateToProps, mapDispatchToProps)(NotLoggedScreen);
