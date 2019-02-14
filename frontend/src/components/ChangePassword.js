import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {types, settingsScreenComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {nvl} from '../common-logic/generic_library.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

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

class ChangePassword extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			newPassword_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/updatePassword";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
				oldPassword: this.state.oldPassword_value,
				password: this.state.newPassword_value,
				password2: this.state.newPassword2_value,
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result === "OK"){
					alert(p_resp.message);
				}
				else {
					alert(p_resp.message);
				}
			/* eslint-disable no-extra-bind */
			}).bind(this);
			/* eslint-enable no-extra-bind */
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		let l_JWT = localStorage.getItem(config.JWTKey);
		f_process_JWT(l_JWT);
	}
	

	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.ChangePassword.oldPassword}
					value={this.state.oldPassword_value}
					type="password"
					onChange={(event) => { this.setState({ oldPassword_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.ChangePassword.newPassword}
					value={this.state.newPassword_value}
					type="password"
					onChange={(event) => { this.setState({ newPassword_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.ChangePassword.newPassword2}
					value={this.state.newPassword2_value}
					type="password"
					onChange={(event) => { this.setState({ newPassword2_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Button variant="contained" 
					color="secondary" 
					className={classes.button}
					onClick={this.componentMainFunction}
			>
				{config.uiTexts.ChangePassword.changePassword}
			</Button>
			<MuiThemeProvider theme={greenTheme}>
				<Button variant="contained"
					color="secondary"
					className={classes.button}
					onClick={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}
				>
					{config.uiTexts.Common.back}
				</Button>
			</MuiThemeProvider>
		</Grid>;
	}
}

const greenTheme = createMuiTheme({ palette: { primary: green } })

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChangePassword));
