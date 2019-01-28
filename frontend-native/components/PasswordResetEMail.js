import React from 'react';
import { ScrollView, StyleSheet, Text  } from 'react-native';

import { connect } from 'react-redux';

import {types, loginComponents} from '../redux-store.js';

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

class PasswordResetEMail extends React.Component {
	render() {
		return <ScrollView style={styles.container}>
		<Text style={styles.helpLinkText}>Password Reset</Text>
		</ScrollView>;
	}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	},
 });
 
 export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetEMail);
