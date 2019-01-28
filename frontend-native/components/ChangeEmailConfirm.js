import React from 'react';
import { ScrollView, StyleSheet, Text  } from 'react-native';

import { connect } from 'react-redux';

import {types, settingsScreenComponents} from '../redux-store.js';

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
	render() {
		return <ScrollView style={styles.container}>
			<Text style={styles.helpLinkText}>Change Email Confirm Component</Text>
		</ScrollView>;
	}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	},
 });
 
 export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmailConfirm);
