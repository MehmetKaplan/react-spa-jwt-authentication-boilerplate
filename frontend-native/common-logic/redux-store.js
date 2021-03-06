import { createStore } from 'redux';

// Define action types
export const types = {
	JWT: 'JWT',
	HOMESCREENNAV: 'NAVIGATEHOMESCREENCOMPONENT',
	SETTINGSSCREENNAV: 'NAVIGATESETTINGSCREENCOMPONENT',
	LOGINNAV: 'NAVIGATELOGINCOMPONENT',
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	HOMESCREENRED: 'RED',
	HOMESCREENBLUE: 'BLUE',
	SIGNUPEMAIL: 'SIGNUPEMAIL',
	FORGOTPWDEMAILJWT: 'FORGOTPWDEMAILJWT',
	CHANGEEMAIL: 'CHANGEEMAIL',
};

export const loginComponents = {
	LOGIN: 'Login',
	SIGNUP1: 'SignUpEmailConfirmation',
	SIGNUP2: 'SignUpRelatedInputs',
	PWDRESET1: 'PasswordResetEMail',
	PWDRESET2: 'PasswordResetNewPassword',
};

export const settingsScreenComponents = {
	SETTINGS: 'Settings',
	PWDCHANGE: 'ChangePassword',
	UPDATEDATA: 'UpdateData',
	EMAILCHANGE1: 'ChangeEmail',
	EMAILCHANGE2: 'ChangeEmailConfirm',
	LOGOUT: 'Logout',
};

export const homeScreenComponents = {
	// Place here your components that you want to navigate in home screen
}

// Define a reducer
export const reducer = (p_state, p_action) => {
	let l_retval = Object.assign({}, p_state); // do not mutate p_state
	switch (p_action.type) {
		case types.JWT:
			l_retval['JWT'] = p_action.JWT;
			break;
		case types.HOMESCREENNAV:
			l_retval['activeHomeScreenComponent'] = p_action.activeHomeScreenComponent;
			break;
		case types.SETTINGSSCREENNAV:
			l_retval['activeSettingsScreenComponent'] = p_action.activeSettingsScreenComponent;
			break;
		case types.LOGINNAV:
			l_retval['activeLoginComponent'] = p_action.activeLoginComponent;
			break;
		case types.LOGIN:
			l_retval['isLogged'] = true;
			break;
		case types.LOGOUT:
			l_retval['isLogged'] = false;
			break;
		case types.SIGNUPEMAIL:
			l_retval['signUpEmail'] = p_action.signUpEmail;
			break;
		case types.FORGOTPWDEMAILJWT:
			l_retval['forgoTPwdEMailJWT'] = p_action.forgoTPwdEMailJWT;
			break;
		//deleteme - start
		case types.HOMESCREENRED:
			l_retval['homeScreenColor'] = 'red';
			break;
		case types.HOMESCREENBLUE:
			l_retval['homeScreenColor'] = 'blue';
			break;
		case types.CHANGEEMAIL:
			l_retval['changeEmail'] = p_action.changeEmail;
			break;
		//deleteme - end
		default:
			// do nothing
	}
	return l_retval;
};

// Define the initial state of our store
export const initialState = {
	JWT: '',
	activeLoginComponent: loginComponents.LOGIN,
	activeSettingsScreenComponent: settingsScreenComponents.SETTINGS,
	activeHomeScreenComponent: null,
	isLogged: false,
	homeScreenColor: 'red',
	signUpEmail: "",
	forgoTPwdEMailJWT: "",
	changeEmail: "",
};

// Create a store, passing our reducer function and our initial state
export const store = createStore(reducer, initialState);
