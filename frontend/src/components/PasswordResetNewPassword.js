import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {types, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

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
		forgoTPwdEMailJWT: state.forgoTPwdEMailJWT,
	});
};

class PasswordResetNewPassword extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			confirmationCode_value: "",
			newPassword_value: "",
			newPassword2_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/resetPwd";
		let l_extra_headers = {
			'Authorization': 'Bearer ' + this.props.forgoTPwdEMailJWT, 
		};
		let l_body = {
			saved_token: this.state.confirmationCode_value,
			password: this.state.newPassword_value,
			password2: this.state.newPassword2_value,
		};
		let l_fnc =  ((p_resp) => {
			alert(p_resp.message);
		/* eslint-disable no-extra-bind */
		}).bind(this);
		/* eslint-enable no-extra-bind */
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.PasswordResetNewPassword.confirmationCode}
					value={this.state.confirmationCode_value}
					onChange={(event) => { this.setState({ confirmationCode_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.PasswordResetNewPassword.newPassword}
					value={this.state.newPassword_value}
					type="password"
					onChange={(event) => { this.setState({ newPassword_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.PasswordResetNewPassword.newPassword2}
					value={this.state.newPassword2_value}
					type="password"
					onChange={(event) => { this.setState({ newPassword2_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={this.componentMainFunction}
				>
					{config.uiTexts.PasswordResetNewPassword.resetPassword}
				</Button>
			</Grid>
			<Grid item xs={12}>
				<MuiThemeProvider theme={greenTheme}>
					<Button variant="contained"
						color="secondary"
						className={classes.button}
						onClick={() => this.props.setAppState(loginComponents.LOGIN)}
					>
						{config.uiTexts.Common.back}
					</Button>
				</MuiThemeProvider>
			</Grid>
		</Grid>;
	}
}


const greenTheme = createMuiTheme({ 
	palette: { primary: green },
	typography: {useNextVariants: true,},
})

const styles = theme => ({
	container: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	textField: {
	  marginLeft: theme.spacing.unit,
	  marginRight: theme.spacing.unit,
	},
	dense: {
	  marginTop: 16,
	},
	menu: {
	  width: 200,
	},
	button: {
		margin: theme.spacing.unit,
	 },  
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PasswordResetNewPassword));

