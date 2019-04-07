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

import CustomSpinner from './CustomSpinner.js';

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
		JWT: state.JWT,
		activeSettingsScreenComponent: state.activeSettingsScreenComponent,
	});
};

class UpdateData extends React.Component {

	constructor() {
		super();
		this.componentMainFunction = this.componentMainFunction.bind(this);
		this.state = {
			name_value: "",
			midname_value: "",
			surname_value: "",
			gender_id_value: "",
			birthday_value: new Date(2000, 1, 1),
			phone_value: "",
			isLoaded: false,
		};
	}

	componentMainFunction(){
		// Place main purpose of component here
		let f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/updateData";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
				gender: this.state.gender_id_value,
				birthday: moment(this.state.birthday_value).format('YYYYMMDDhhmmss'),
				phone: this.state.phone_value,
				name: this.state.name_value,
				midname: this.state.midname_value,
				surname: this.state.surname_value,
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
		};
		f_process_JWT(this.props.JWT);
	}

	componentDidMount(){
		let f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/getUserData";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result === "OK"){
					this.setState({
						isLoaded: true,
						name_value: p_resp.name,
						midname_value: p_resp.midname,
						surname_value: p_resp.surname,
						gender_id_value: nvl(p_resp.gender_id, "3").toString(),
						birthday_value: (nvl(p_resp.birthday, "") === "") ? moment(new Date(2000, 1, 1), 'YYYYMMDDhhmmss').toDate() : moment(p_resp.birthday, 'YYYYMMDDhhmmss').toDate(),
						phone_value: p_resp.phone,
					});
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
		if (!(this.state.isLoaded)) return <CustomSpinner />;

		return <Grid container spacing={16}>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.UpdateData.name}
					value={this.state.name_value}
					onChange={(event) => { this.setState({ name_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
					style={{ color: "green" }}
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.UpdateData.midname}
					value={this.state.midname_value}
					onChange={(event) => { this.setState({ midname_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
					style={{ color: "green" }}
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.UpdateData.surname}
					value={this.state.surname_value}
					onChange={(event) => { this.setState({ surname_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
					style={{ color: "green" }}
				/>
			</Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}></Grid>
			<Grid item xs={12}>
				<TextField
					label={config.uiTexts.UpdateData.phone}
					value={nvl(this.state.phone_value, "")}
					onChange={(event) => { this.setState({ phone_value: event.target.value }) }}
					className={classes.textField}
					margin="normal"
					variant="outlined"
					style={{ color: "green" }}
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
						{config.uiTexts.UpdateData.gender_id} 
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
						<MenuItem value={"1"}>{config.uiTexts.UpdateData.genders.male}</MenuItem>
						<MenuItem value={"2"}>{config.uiTexts.UpdateData.genders.female}</MenuItem>
						<MenuItem value={"3"}>{config.uiTexts.UpdateData.genders.other}</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
						id="date"
						label={config.uiTexts.UpdateData.birthday}
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
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
		selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateData));
