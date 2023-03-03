import isEmpty from '../../common/validation';
import * as actions from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: undefined,
    isLoading: false,
    loadData: false,
    errorMessage: ""
};

const authReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case actions.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
                loadData: true
            };
        case actions.SET_CURRENT_USER_DATA:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
                loadData: false
            };
        case actions.UNSET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: false,
                user: undefined
            };
        case actions.SET_LOADER:
            return {
                ...state,
                isLoading: action.payload,
            };
        case actions.SET_CURRENT_USER_LOGIN_ERROR:
            return {
                ...state,
                isError: true,
                errorMessage: action.message
            };
        case actions.UNSET_CURRENT_USER_LOGIN_ERROR:
            return {
                ...state,
                isError: false,
                errorMessage: action.message
            };
        default:
            return state;
    }
}

export default authReducer;
