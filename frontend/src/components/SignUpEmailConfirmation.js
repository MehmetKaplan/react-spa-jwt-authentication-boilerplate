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
		setSignUpEmail: (p_signupemail) => {dispatch({
			type: types.SIGNUPEMAIL,
			signUpEmail: p_signupemail
		})},
	})
};

function mapStateToProps(state) {
	return({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class SignUpEmailConfirmation extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			email_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/generateEmailOwnershipToken";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result === "OK")
			{
				alert(JSON.stringify(p_resp));
				this.props.setSignUpEmail(this.state.email_value);
				this.props.setAppState(loginComponents.SIGNUP2);
			}
			else {
				alert(p_resp.message);
			}
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
					label={config.uiTexts.SignUpEmailConfirmation.email}
					value={this.state.email_value}
					onChange={(event) => { this.setState({ email_value: event.target.value }) }}
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
					{config.uiTexts.SignUpEmailConfirmation.sendConfirmation}
				</Button>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignUpEmailConfirmation));
