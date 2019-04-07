import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import { isMobile } from 'react-device-detect';

import { types, loginComponents } from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import { fetch_data_v2 } from '../common-logic/fetchhandler.js';
import {nvl} from '../common-logic/generic_library.js';

const c_grid_margin = isMobile ? 1 : 3;
const c_grid_content = 12 - (2 * c_grid_margin);

function mapDispatchToProps(dispatch) {
	return ({
		setJWT: (l_JWT) => {
			dispatch({
				type: types.JWT,
				JWT: l_JWT
			})
		},
		setAppState: (p_new_active_component) => {
			dispatch({
				type: types.LOGINNAV,
				activeLoginComponent: p_new_active_component
			})
		},
		setLoginState: (l_logIn) => {
			let l_type = l_logIn ? types.LOGIN : types.LOGOUT;
			dispatch({ type: l_type })
		},
	})
};

function mapStateToProps(state) {
	return ({
		activeLoginComponent: state.activeLoginComponent,
	});
};

class Login extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.FBLogIn = this.FBLogIn.bind(this);
		this.GoogleLogIn = this.GoogleLogIn.bind(this);
		this.state = {
			email_value: "",
			password_value: "",
			remember_me: false,
		};
	}

	componentDidMount() {
	}

	componentMainFunction() {
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/login";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.email_value,
			password: this.state.password_value,
		};
		let l_fnc = ((p_resp) => {
			if (p_resp.result === "OK") {
				this.props.setJWT(p_resp.JWT);
				this.props.setLoginState(true);
				if (this.state.remember_me) localStorage.setItem(config.JWTKey, p_resp.JWT);
			}
			else alert(JSON.stringify(p_resp));
		}).bind(this); // eslint-disable-line no-extra-bind
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	FBLogIn(response) {
		if (config.debugMode) console.log(response);
		if (nvl(response.id, "x") === "x") {
			alert(`Facebook Login Error`);
			return;
		}
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/loginViaSocial";
		let l_extra_headers = {};
		let l_body = {
			socialsite: config.signalsFrontendBackend.socialSites.facebook,
			token: response.accessToken,
		};
		let l_fnc = ((p_resp) => {
			if (p_resp.result === "OK") {
				this.props.setJWT(p_resp.JWT);
				this.props.setLoginState(true);
				if (this.state.remember_me) localStorage.setItem(config.JWTKey, p_resp.JWT);
			}
			else alert(JSON.stringify(p_resp));
		}).bind(this); // eslint-disable-line no-extra-bind
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	GoogleLogIn(response){
		if (config.debugMode) console.log(response);
		if (nvl(response.googleId, "x") === "x") {
			alert(`Google Login Error`);
			return;
		}
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/loginViaSocial";
		let l_extra_headers = {};
		let l_body = {
			socialsite: config.signalsFrontendBackend.socialSites.google,
			token: response.accessToken,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result === "OK"){
				this.props.setJWT(p_resp.JWT);
				this.props.setLoginState(true);
				if (this.state.remember_me) localStorage.setItem(config.JWTKey, p_resp.JWT);
			}
			else alert(JSON.stringify(p_resp));
		}).bind(this); // eslint-disable-line no-extra-bind
		fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
	}

	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16} >
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content} classes={{ grid: classes.grid }}>
					<Grid container spacing={16} alignItems="center" justify="center" >
						<TextField
							label={config.uiTexts.Login.email}
							value={this.state.email_value}
							onChange={(event) => { this.setState({ email_value: event.target.value }) }}
							className={classes.textField}
							margin="normal"
							variant="outlined"
						/>
					</Grid>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16} >
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Grid container spacing={16} alignItems="center" justify="center" >
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
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid container spacing={16} >
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Grid container spacing={16} alignItems="center" justify="center" >
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.remember_me}
									onChange={() => {
										let l_new_state = !(this.state.remember_me);
										this.setState({ remember_me: l_new_state });
									}}
									value="checkedA"
								/>
							}
							label={config.uiTexts.Login.rememberMe}
						/>
					</Grid>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16}>
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Button variant="contained"
						color="secondary"
						className={classes.button}
						onClick={this.componentMainFunction}
					>
						{config.uiTexts.Login.login}
					</Button>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16}>
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Button variant="contained"
						className={classes.button}
						onClick={() => this.props.setAppState(loginComponents.PWDRESET1)}
					>
						{config.uiTexts.Login.forgotPassword}
					</Button>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16}>
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Button variant="contained"
						className={classes.button}
						onClick={() => this.props.setAppState(loginComponents.SIGNUP1)}
					>
						{config.uiTexts.Login.signUp}
					</Button>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16}>
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Grid container spacing={16} alignItems="center" justify="center" >
						<FacebookLogin
							appId={config.FacebookAppID}
							autoLoad={false}
							callback={this.FBLogIn} />
					</Grid>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid container spacing={16}>
				<Grid item xs={c_grid_margin}></Grid>
				<Grid item xs={c_grid_content}>
					<Grid container spacing={16} alignItems="center" justify="center" >
						<GoogleLogin
							clientId={config.GoogleClientIdWeb}
							buttonText={config.uiTexts.Login.GoogleLogin}
							onSuccess={this.GoogleLogIn}
							onFailure={this.GoogleLogIn}
							cookiePolicy={'single_host_origin'}
						/>
					</Grid>
				</Grid>
				<Grid item xs={c_grid_margin}></Grid>
			</Grid>
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
		display: "block",
		width: "100%"
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
