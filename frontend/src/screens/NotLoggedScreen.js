import React from 'react';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';

import {types, loginComponents} from '../common-logic/redux-store.js';

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
		return <div style={{display:'flex', justifyContent: 'center'}}>
			<Grid container spacing={16}>
				<Grid item xs={12}>
					{l_active_component}
				</Grid>
			</Grid>
		</div>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NotLoggedScreen);
