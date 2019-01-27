import { createStore } from 'redux';

// Define action types
export const types = {
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	HOMESCREENRED: 'RED',
	HOMESCREENBLUE: 'BLUE',
};

// Define a reducer
export const reducer = (p_state, p_action) => {
	let l_retval = Object.assign({}, p_state); // do not mutate p_state
	switch (p_action.type) {
		case types.LOGIN:
			l_retval['isLogged'] = true;
			break;
		case types.LOGOUT:
			l_retval['isLogged'] = false;
			break;
		case types.HOMESCREENRED:
			l_retval['homeScreenColor'] = 'red';
			break;
		case types.HOMESCREENBLUE:
			l_retval['homeScreenColor'] = 'blue';
			break;
		default:
			// do nothing
	}
	return l_retval;
};

// Define the initial state of our store
export const initialState = { 
	isLogged: false,
	homeScreenColor: 'red',
};

// Create a store, passing our reducer function and our initial state
export const store = createStore(reducer, initialState);
