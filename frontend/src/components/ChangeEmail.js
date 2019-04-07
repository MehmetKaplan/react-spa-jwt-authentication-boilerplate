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
import {fetch_data_v2} from '../common-logic/fetchhandler.js';

function mapDispatchToProps(dispatch) {
	return ({
		setAppState: (p_new_active_component) => {
			dispatch({
				type: types.SETTINGSSCREENNAV,
				activeSettingsScreenComponent: p_new_active_component,
			})
		},
		setChangeEmail: (p_changeemail) => {dispatch({
			type: types.CHANGEEMAIL,
			changeEmail: p_changeemail
		})},

	})
};

function mapStateToProps(state) {
	return ({
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class ChangeEmail extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			newEMail_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/generateEmailOwnershipToken";
		let l_extra_headers = {};
		let l_body = {
			email: this.state.newEMail_value,
		};
		let l_fnc =  ((p_resp) => {
			if (p_resp.result === "OK")
			{
				alert(p_resp.message);
				this.props.setChangeEmail(this.state.newEMail_value);
				this.props.setAppState(settingsScreenComponents.EMAILCHANGE2);
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
					label={config.uiTexts.ChangeEmail.newEMail}
					value={this.state.newEMail_value} 
					onChange={(event) => { this.setState({ newEMail_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={this.componentMainFunction}
				>
					{config.uiTexts.ChangeEmail.sendConfirmationCode}
				</Button>
			</Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChangeEmail));
