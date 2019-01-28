import { createStore } from 'redux';

// Define action types
export const types = {
	HOMESCREENNAV: 'NAVIGATEHOMESCREENCOMPONENT',
	SETTINGSSCREENNAV: 'NAVIGATESETTINGSCREENCOMPONENT',
	LOGINNAV: 'NAVIGATELOGINCOMPONENT',
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	HOMESCREENRED: 'RED',
	HOMESCREENBLUE: 'BLUE',
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
	EMAILCHANGE1: 'ChangeEmailConfirm',
	EMAILCHANGE2: 'ChangeEmail',
};

export const homeScreenComponents = {
	// Place here your components that you want to navigate in home screen
}

// Define a reducer
export const reducer = (p_state, p_action) => {
	let l_retval = Object.assign({}, p_state); // do not mutate p_state
	switch (p_action.type) {
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
		//deleteme - start
		case types.HOMESCREENRED:
			l_retval['homeScreenColor'] = 'red';
			break;
		case types.HOMESCREENBLUE:
			l_retval['homeScreenColor'] = 'blue';
			break;
		//deleteme - end
		default:
			// do nothing
	}
	return l_retval;
};

// Define the initial state of our store
export const initialState = {
	activeLoginComponent: loginComponents.LOGIN,
	activeSettingsScreenComponent: settingsScreenComponents.SETTINGS,
	activeHomeScreenComponent: null,
	isLogged: false,
	homeScreenColor: 'red',
};

// Create a store, passing our reducer function and our initial state
export const store = createStore(reducer, initialState);
