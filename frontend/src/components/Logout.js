import React from 'react';

import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {types, settingsScreenComponents, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';


function mapDispatchToProps(dispatch) {
	return({
		setJWT: (l_JWT) => {
			dispatch({
				type: types.JWT,
				JWT: l_JWT
			})
		},
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
		this.props.setJWT('');
		localStorage.removeItem(config.JWTKey);
		this.props.setLoginState(false);
		this.props.setAppState(loginComponents.LOGIN);
	}

	render() {
		const { classes } = this.props;
		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>{config.uiTexts.Logout.logout}</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
						color="secondary" 
						className={classes.button}
						onClick={this.componentMainFunction}
				>
					{config.uiTexts.Common.yes}
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
						{config.uiTexts.Common.no}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Logout));
