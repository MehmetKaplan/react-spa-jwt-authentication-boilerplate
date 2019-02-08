import React from 'react';
import {AsyncStorage} from 'react-native';

import { connect } from 'react-redux';
import moment from "moment";

import { Form, Item, Label, Input, Button, Text, Picker, DatePicker } from 'native-base';

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
		f_process_JWT = (p_JWT) => {
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
				if (p_resp.result == "OK"){
					alert(p_resp.message);
				}
				else {
					alert(p_resp.message);
				}
			}).bind(this);
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		AsyncStorage.getItem(config.JWTKey)
			.then((l_JWT) => f_process_JWT(l_JWT));
	}

	componentDidMount(){
		f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/getUserData";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
			};
			let l_fnc =  ((p_resp) => {
				if (p_resp.result == "OK"){
					this.setState({
						isLoaded: true,
						name_value: p_resp.name,
						midname_value: p_resp.midname,
						surname_value: p_resp.surname,
						gender_id_value: p_resp.gender_id.toString(),
						birthday_value: moment(p_resp.birthday, 'YYYYMMDDhhmmss').toDate(),
						phone_value: p_resp.phone,
					});
				}
				else {
					alert(p_resp.message);
				}
			}).bind(this);
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		AsyncStorage.getItem(config.JWTKey)
			.then((l_JWT) => f_process_JWT(l_JWT));
	}

	render() {
		if (!(this.state.isLoaded)) return <CustomSpinner />;

		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.name}</Label>
				<Input 
					value={this.state.name_value} 
					onChangeText={(value) => {this.setState({name_value: value})}}
					style={{ color: "green" }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.midname}</Label>
				<Input 
					value={this.state.midname_value} 
					onChangeText={(value) => {this.setState({midname_value: value})}}
					style={{ color: "green" }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.surname}</Label>
				<Input 
					value={this.state.surname_value} 
					onChangeText={(value) => {this.setState({surname_value: value})}}
					style={{ color: "green" }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.phone}</Label>
				<Input 
					value={this.state.phone_value} 
					onChangeText={(value) => {this.setState({phone_value: value})}}
					style={{ color: "green" }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>

			<Picker
				block
				note
				mode="dropdown"
				placeholder={config.uiTexts.UpdateData.gender_id} 
				selectedValue={this.state.gender_id_value}
				itemStyle={{ foregroundColor: "green"}}
				onValueChange={(value) => {this.setState({gender_id_value: value})}}
			>
				<Picker.Item label={config.uiTexts.UpdateData.genders.male} value="1" />
				<Picker.Item label={config.uiTexts.UpdateData.genders.female} value="2" />
				<Picker.Item label={config.uiTexts.UpdateData.genders.other } value="3" />
			</Picker>

			<Text></Text>
			<Text></Text>
			<DatePicker
				defaultDate={this.state.birthday_value}
				minimumDate={new Date(1930, 1, 1)}
				maximumDate={new Date()}
				locale={"en"}
				timeZoneOffsetInMinutes={-1 * (new Date()).getTimezoneOffset()}
				modalTransparent={false}
				animationType={"fade"}
				androidMode={"default"}
				textStyle={{ color: "green" }}
				placeHolderTextStyle={{ color: "#d3d3d3" }}
				onDateChange={(newDate) => {this.setState({ birthday_value: newDate });}}
				disabled={false}
			/>

			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Common.submit}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(settingsScreenComponents.SETTINGS)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateData);
