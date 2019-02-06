import React from 'react';

import { connect } from 'react-redux';

import {types} from '../redux-store.js';

import YourApplication from '../components/YourApplication.js';

function mapDispatchToProps(dispatch) {
	return({
		makered: () => {dispatch({type: types.HOMESCREENRED})},
		makeblue: () => {dispatch({type: types.HOMESCREENBLUE})},
		setAppState: (p_new_active_component) => {dispatch({
			type: types.LOGINNAV,
			activeLoginComponent: p_new_active_component
		})},
	})
};

function mapStateToProps(state) {
	return({
		homeScreenColorFromUp: state.homeScreenColor,
		hostMachine: state.hostMachine,
	});
};

class HomeScreen extends React.Component {

	constructor(props){
		super(props);
		this.state = {
		};
	};
	
	render() {
		return <YourApplication />;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
