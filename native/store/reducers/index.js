import {combineReducers} from 'redux';
import newDriverReducer from './newDriverReducer';
import authReducer from './authReducer';
import pageReducer from './pageReducer';
import errorReducer from './errorReducer';
import appointmentReducer from './appointment';
import customersReducer from './customer';

export default combineReducers({
	auth: authReducer,
    pageReducer,
    newDriverReducer,
    errorReducer,
    appointmentReducer: appointmentReducer,
    customers : customersReducer
});