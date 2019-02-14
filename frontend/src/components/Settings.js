import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import {types, settingsScreenComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';

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

class Settings extends React.Component {
	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="primary" 
						className={classes.button}
						onClick={() => this.props.setAppState(settingsScreenComponents.UPDATEDATA)}
				>
					{config.uiTexts.Settings.updateData}
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={() => this.props.setAppState(settingsScreenComponents.PWDCHANGE)}
				>
					{config.uiTexts.Settings.changePwd}
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={() => this.props.setAppState(settingsScreenComponents.EMAILCHANGE1)}
				>
					{config.uiTexts.Settings.changeEmail}
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={() => this.props.setAppState(settingsScreenComponents.LOGOUT)}
				>
					{config.uiTexts.Settings.logout}
				</Button>
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
	 },  
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings));



