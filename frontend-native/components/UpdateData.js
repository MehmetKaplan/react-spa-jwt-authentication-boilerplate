import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text, Picker } from 'native-base';

import {types, settingsScreenComponents} from '../redux-store.js';
import config from '../config.js';

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
			gender_id_value: "G3",
			birthday_value: "20000101000000",
			phone_value: "",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		alert(this.state.name_value);
		alert(this.state.midname_value);
		alert(this.state.surname_value);
		alert(this.state.gender_id_value);
		alert(this.state.birthday_value);
		alert(this.state.phone_value);
		this.props.setAppState(settingsScreenComponents.SETTINGS);
	}

	render() {
 /*
	name varchar(100),
	midname varchar(100),
	surname varchar(100),
	gender_id integer,
	birthday datetime,
	phone varchar(100),
	ResetPasswordSecondToken varchar(255),
	ResetPasswordSecondTokenValidFrom varchar(255)
 */
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.name}</Label>
				<Input 
					value={this.state.name_value} 
					onChangeText={(value) => {this.setState({name_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.midname}</Label>
				<Input 
					value={this.state.midname_value} 
					onChangeText={(value) => {this.setState({midname_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.surname}</Label>
				<Input 
					value={this.state.surname_value} 
					onChangeText={(value) => {this.setState({surname_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.UpdateData.phone}</Label>
				<Input 
					value={this.state.phone_value} 
					onChangeText={(value) => {this.setState({phone_value: value})}}
				/>
			</Item>
			<Text></Text>
			<Text></Text>

			<Picker
				block
				note
				mode="dropdown"
				selectedValue={this.state.gender_id_value}
				onValueChange={(value) => {this.setState.state({gender_id_value: value})}}
			>
				<Picker.Item label={config.uiTexts.UpdateData.genders.male  } value="G1" />
				<Picker.Item label={config.uiTexts.UpdateData.genders.female} value="G2" />
				<Picker.Item label={config.uiTexts.UpdateData.genders.other } value="G3" />
			</Picker>


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


