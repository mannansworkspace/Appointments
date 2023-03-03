import isEmpty from '../../common/validation';

import * as actions from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: undefined,
    isLoading: false,
    isError: false,
    errorMessage: ""
};

const superAdminAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_SUPERADMIN_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case actions.UNSET_SUPERADMIN_USER:
            return {
                ...state,
                isAuthenticated: false,
                user: undefined
            };
        case actions.SET_SUPERADMIN_USER_LOGIN_LOADER:
            return {
                ...state,
                isLoading: true,
                isError: false,
                errorMessage: "",
            };
        case actions.UNSET_SUPERADMIN_USER_LOGIN_LOADER:
            return {
                ...state,
                isLoading: false
            };
        case actions.SET_SUPERADMIN_USER_LOGIN_ERROR:
            return {
                ...state,
                isError: true,
                errorMessage: action.message
            };
        case actions.UNSET_SUPERADMIN_USER_LOGIN_ERROR:
            return {
                ...state,
                isError: false,
                errorMessage: action.message
            };
        default:
            return state;
    }
}

export default superAdminAuthReducer;