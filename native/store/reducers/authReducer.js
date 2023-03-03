import {SET_CURRENT_USER, CLEAR_CURRENT_USER} from '../actions/types';

const initialState = { 
	isAuthenticated: false,
	user: {}
};

// do not change in this redurcer it will cause app.js
const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: true,
				user: action.payload
			};
			
		case CLEAR_CURRENT_USER:
			return {
				...state,
				isAuthenticated: false,
				user: {}
			};

		default:
			return state;
	}
}

export default authReducer;