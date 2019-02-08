import React from 'react';
import {AsyncStorage} from 'react-native';

import { connect } from 'react-redux';

import { Form, Button, Text } from 'native-base';

import {types, settingsScreenComponents, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';


function mapDispatchToProps(dispatch) {
	return({
		setAppState: (p_new_active_component) => {dispatch({
			type: types.SETTINGSSCREENNAV,
			activeSettingsScreenComponent: p_new_active_component
		})},
		setLoginState: (l_logIn) => {
			let l_type = l_logIn ?  types.LOGIN : types.LOGOUT;
			dispatch({type: l_type})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class Logout extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
		};
	}

	componentDidMount(){
	}

	componentMainFunction(){
		// Place main purpose of component here

		AsyncStorage.removeItem(config.JWTKey)
			.then(() => {
				this.props.setLoginState(false);
				this.props.setAppState(loginComponents.LOGIN);
			});
	}


	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Text>{config.uiTexts.Logout.logout}</Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Common.yes}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.no}</Text></Button>
		</Form>;
	} 
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
