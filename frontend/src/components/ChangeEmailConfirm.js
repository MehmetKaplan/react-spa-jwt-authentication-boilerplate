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
		setJWT: (l_JWT) => {
			dispatch({
				type: types.JWT,
				JWT: l_JWT
			})
		},
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
		JWT: state.JWT,
		changeEmail: state.changeEmail,
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class ChangeEmailConfirm extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			confirmationCode_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here
		let f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/updateEMail";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
				email: this.props.changeEmail,
				emailtoken: this.state.confirmationCode_value,
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result === "OK"){
					alert(p_resp.message);
					localStorage.removeItem(config.JWTKey);
					this.props.setJWT(p_resp.JWT);
					this.props.setAppState(settingsScreenComponents.SETTINGS);
				}
				else {
					alert(p_resp.message);
				}
			/* eslint-disable no-extra-bind */
			}).bind(this);
			/* eslint-enable no-extra-bind */
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		};
		f_process_JWT(this.props.JWT);
	}

	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.ChangeEmailConfirm.confirmationCode}
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
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={this.componentMainFunction}
				>
					{config.uiTexts.Common.submit}
				</Button>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<MuiThemeProvider theme={greenTheme}>
					<Button variant="contained"
						color="secondary"
						className={classes.button}
						onClick={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}
					>
						{config.uiTexts.Common.back}
					</Button>
				</MuiThemeProvider>
			</Grid>
		</Grid>;
	}
}

const greenTheme = createMuiTheme({ 
	palette: { primary: green } ,
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChangeEmailConfirm));
