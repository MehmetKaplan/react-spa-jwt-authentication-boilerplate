import React, { Component } from 'react';
import './App.css';
import CustomSpinner from './components/CustomSpinner.js';
import { connect } from 'react-redux';
import {types} from './common-logic/redux-store.js';
import config from './common-logic/config.js';
import {fetch_data_v2} from './common-logic/fetchhandler.js';
import {nvl} from './common-logic/generic_library.js';

function mapDispatchToProps(dispatch) {
	return({
			  setLoginState: (l_logIn) => {
						 let l_type = l_logIn ?  types.LOGIN : types.LOGOUT;
						 dispatch({type: l_type})},
	})
};

function mapStateToProps(state) {
	return({
			  isLogged: state.isLogged,
	});
};

class App_ extends Component {

	constructor(props){
		super(props);
		this.state = {
				  JWTState: "checking",
		};
	};

	componentDidMount(){
//deleteme
localStorage.setItem(config.JWTKey, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NDk4MTYwMDksImV4cCI6MTU0OTkwMjQwOX0.3_pbLCEy46th-sDEpGsEoXrt353pRPDcLmWzVHGevEs');
localStorage.setItem(config.JWTKey, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NDk4MTYwMDksImV4cCI6MTU0OTkwMjQwOX0.3_pbLCEy46th-sDEpGsEoXrt353pRPDcLmWzVHGevEs');
		this.setState({JWTState: "checking"});
		let l_JWT = localStorage.getItem(config.JWTKey);
		let f_process_JWT = (p_JWT) => {
			let l_method = "POST";
			let l_uri = config.mainServerBaseURL + "/checkJWT";
			let l_extra_headers = {
				'Authorization': 'Bearer ' + nvl(p_JWT, "xx"),
			};
			let l_body = {
			};
			let l_fnc = ((p_resp) => {
				this.setState({ JWTState: "checked" });
				if (p_resp.result == "OK") {
					this.props.setLoginState(true);
				}
				else {
					this.props.setLoginState(false);
					alert(p_resp.message);
				}
			/* eslint-disable no-extra-bind */
			}).bind(this);
			/* eslint-enable no-extra-bind */
			fetch_data_v2(l_method, l_uri, l_extra_headers, l_body, l_fnc);
		}
		f_process_JWT(l_JWT);
	}



	render() {
		if (this.state.JWTState == "ckecking") return <CustomSpinner />;

		let l_login_page = <div>NOT LOGGED</div>  // <NotLoggedScreen />;
		let l_homescreen = <div>LOGGED IN</div>  // <YourApplication.js />
		let l_mainpage = this.props.isLogged ? l_homescreen : l_login_page;
		return (l_mainpage);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App_);
