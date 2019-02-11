import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {types, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

function mapDispatchToProps(dispatch) {
	return({
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
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

class Login extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			email_value: "",
			password_value: "",
		};
	}

	componentDidMount(){
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/login";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
			password: this.state.password_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result === "OK"){
				localStorage.setItem(config.JWTKey, p_resp.JWT);
				this.props.setLoginState(true);
			}
			else alert(JSON.stringify(p_resp));
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
					label={config.uiTexts.Login.email}
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
				<TextField
					label={config.uiTexts.Login.password}
					value={this.state.password_value}
					type="password"
					onChange={(event) => { this.setState({ password_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Button variant="contained" 
					color="secondary" 
					className={classes.button}
					onClick={this.componentMainFunction}
			>
				{config.uiTexts.Login.login} 
			</Button>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Button variant="contained" 
					className={classes.button}
					onClick={() => this.props.setAppState(loginComponents.PWDRESET1)}
			>
				{config.uiTexts.Login.forgotPassword}
			</Button>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Button variant="contained" 
					className={classes.button}
					onClick={() => this.props.setAppState(loginComponents.SIGNUP1)}
			>
				{config.uiTexts.Login.signUp}
			</Button>
		</Grid>;
	} 
}

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
