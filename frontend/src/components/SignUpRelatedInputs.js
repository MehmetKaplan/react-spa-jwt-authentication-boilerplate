import React from 'react';

import { connect } from 'react-redux';
import moment from "moment";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';

import {types, loginComponents} from '../common-logic/redux-store.js';
import config from '../common-logic/config.js';
import {fetch_data_v2} from '../common-logic/fetchhandler.js';
import {nvl, date_to_str} from '../common-logic/generic_library.js';

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
		signUpEmail: state.signUpEmail,
	});
};

class SignUpRelatedInputs extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			confirmationCode_value: "",
			password_value: "",
			password2_value: "",
			name_value: "",
			midname_value: "",
			surname_value: "",
			gender_id_value: "",
			birthday_value: new Date(2000, 1, 1),
			phone_value: "",
			genders_value: "3",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		let l_method = "POST";
		let l_uri = config.mainServerBaseURL + "/signUp";
		let l_extra_headers = {};
		let l_body = {
			email: this.props.signUpEmail,
			confirmationCode: this.state.confirmationCode_value,
			password: this.state.password_value,
			password2: this.state.password2_value,
			name: this.state.name_value,
			midname: this.state.midname_value,
			surname: this.state.surname_value,
			gender_id: nvl(this.state.gender_id_value, "3"),
			birthday: date_to_str(this.state.birthday_value, "yyyyMMddhhmmss"),
			phone: this.state.phone_value,
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
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.confirmationCode}
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
					label={config.uiTexts.SignUpRelatedInputs.password}
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
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.password2}
					value={this.state.password2_value}
					type="password"
					onChange={(event) => { this.setState({ password2_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.name}
					value={this.state.name_value}
					onChange={(event) => { this.setState({ name_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.midname}
					value={this.state.midname_value}
					onChange={(event) => { this.setState({ midname_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.surname}
					value={this.state.surname_value}
					onChange={(event) => { this.setState({ surname_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.SignUpRelatedInputs.phone}
					value={this.state.phone_value}
					onChange={(event) => { this.setState({ phone_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel
						ref={ref => {
							this.InputLabelRef = ref;
						}}
						htmlFor="gender-select"
					>
						{config.uiTexts.SignUpRelatedInputs.gender_id}
					</InputLabel>
					<Select
						value={this.state.gender_id_value}
						onChange={(event) => {this.setState({ gender_id_value: event.target.value});}}
						input={
							<OutlinedInput
								labelWidth={50}
								name="genderSelect"
								id="gender-select"
							/>
						}
					>
						<MenuItem value={"1"}>{config.uiTexts.SignUpRelatedInputs.genders.male}</MenuItem>
						<MenuItem value={"2"}>{config.uiTexts.SignUpRelatedInputs.genders.female}</MenuItem>
						<MenuItem value={"3"}>{config.uiTexts.SignUpRelatedInputs.genders.other}</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
						id="date"
						label={config.uiTexts.SignUpRelatedInputs.birthday}
						type="date"
						defaultValue={moment(this.state.birthday_value).format("YYYY-MM-DD")}
						className={classes.textField}
						InputLabelProps={{
							shrink: true,
						}}
						onChange={(event) => {this.setState({ birthday_value: moment(event.target.value, "YYYY-MM-DD").toDate() });}}
					/>
			</Grid>
			<Grid item xs={12}>
				<Button variant="contained" 
					color="secondary" 
					className={classes.button}
					onClick={this.componentMainFunction}
				>
					{config.uiTexts.Common.submit}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignUpRelatedInputs));
