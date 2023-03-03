import {
	SET_SID,
	SET_DRIVER,
	SET_RECOVERY
 } from '../actions/types';

const initialState = {
	sid : '',
	newDriver : {},
	passwordRecovery : {}
};

// do not change in this redurcer it will cause app.js
const newDriverReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_SID:
			return {
				...state,
				sid : action.payload.verificationSid
			};

		case SET_DRIVER:
			return {
				...state,
				newDriver : { ...state.newDriver, ...action.payload }
			};
		case SET_RECOVERY:
			return {
				...state,
				passwordRecovery : { ...state.passwordRecovery, ...action.payload }
			}

		default:
			return state;
	}
}

export default newDriverReducer;


        