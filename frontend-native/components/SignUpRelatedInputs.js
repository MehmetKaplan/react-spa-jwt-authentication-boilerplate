import React from 'react';

import { connect } from 'react-redux';

import { Form, Item, Label, Input, Button, Text, Picker, DatePicker } from 'native-base';

import {types, loginComponents} from '../redux-store.js';
import config from '../common-logic/config.js';

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
			gender_id_value: "G3",
			birthday_value: new Date(2000, 1, 1),
			phone_value: "",
			genders_value: "3",
		};
	}

	componentMainFunction(){
		// Place main purpose of component here

		// use this.state.newPassword_value to send the confirmation code
		alert(
			  "\n this.state.confirmationCode_value:" + this.state.confirmationCode_value
			+ "\n this.state.password_value:" + this.state.password_value
			+ "\n this.state.password2_value:" + this.state.password2_value
			+ "\n this.state.name_value:" + this.state.name_value
			+ "\n this.state.midname_value:" + this.state.midname_value
			+ "\n this.state.surname_value:" + this.state.surname_value
			+ "\n this.state.gender_id_value:" + this.state.gender_id_value
			+ "\n this.state.birthday_value:" + this.state.birthday_value
			+ "\n this.state.phone_value:" + this.state.phone_value
		 );
		this.props.setAppState(loginComponents.SIGNUP2);
	}

	render() {
		return <Form>
			<Text></Text>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.confirmationCode}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.confirmationCode_value}
					onChangeText={(value) => { this.setState({ confirmationCode_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.password}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.password_value}
					onChangeText={(value) => { this.setState({ password_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.password2}</Label>
				<Input
					secureTextEntry={true}
					value={this.state.password2_value}
					onChangeText={(value) => { this.setState({ password2_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.name}</Label>
				<Input
					value={this.state.name_value}
					onChangeText={(value) => { this.setState({ name_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.midname}</Label>
				<Input
					value={this.state.midname_value}
					onChangeText={(value) => { this.setState({ midname_value: value }) }}
				/>
			</Item>
			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.surname}</Label>
				<Input
					value={this.state.surname_value}
					onChangeText={(value) => { this.setState({ surname_value: value }) }}
				/>
			</Item>


			<Text></Text>
			<Text></Text>
			<Item floatingLabel>
				<Label>{config.uiTexts.SignUpRelatedInputs.phone}</Label>
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
				placeholder={config.uiTexts.SignUpRelatedInputs.gender_id} 
				selectedValue={this.state.gender_id_value}
				onValueChange={(value) => {this.setState({gender_id_value: value})}}
			>
				<Picker.Item label={config.uiTexts.SignUpRelatedInputs.genders.male} value="G1" />
				<Picker.Item label={config.uiTexts.SignUpRelatedInputs.genders.female} value="G2" />
				<Picker.Item label={config.uiTexts.SignUpRelatedInputs.genders.other } value="G3" />
			</Picker>

			<Text></Text>
			<Text></Text>
			<DatePicker
				defaultDate={new Date(2000, 1, 1)}
				minimumDate={new Date(1950, 1, 1)}
				maximumDate={new Date()}
				locale={"en"}
				timeZoneOffsetInMinutes={undefined}
				modalTransparent={false}
				animationType={"fade"}
				androidMode={"default"}
				placeHolderText={config.uiTexts.SignUpRelatedInputs.birthday }
				textStyle={{ color: "green" }}
				placeHolderTextStyle={{ color: "#d3d3d3" }}
				onDateChange={(newDate) => this.setState({ birthday_value: newDate })}
				disabled={false}
			/>

			<Text></Text>
			<Text></Text>
			<Button block danger onPress={this.componentMainFunction}><Text> {config.uiTexts.Common.submit}  </Text></Button>
			<Text></Text>
			<Text></Text>
			<Button block success onPress={() => this.props.setAppState(loginComponents.LOGIN)}><Text>{config.uiTexts.Common.back}</Text></Button>
		</Form>;
	}
}
 export default connect(mapStateToProps, mapDispatchToProps)(SignUpRelatedInputs);
