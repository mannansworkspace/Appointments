import axios from 'axios'
import setAuthToken from '../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import * as actions from './types'
const backendServerURL = process.env.REACT_APP_API_URL
export const registerApi = (data) => dispatch => {
    axios.post(backendServerURL + '/user/register', data)
        .then(res => {
            console.log('res', res.data)
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const superadminloginApi = (data, history) => dispatch => {
    dispatch({
        type: actions.UNSET_SUPERADMIN_USER_LOGIN_ERROR,
        message: ""
    });
    axios.post(backendServerURL + '/superadmin/login', data)
        .then(res => {
            localStorage.setItem('jwtTokenAdmin', res.data);
            setAuthToken(res.data);
            const decoded = jwt_decode(res.data);
            dispatch({
                type: actions.UNSET_SUPERADMIN_USER_LOGIN_ERROR,
                message: ""
            });
            dispatch({
                type: actions.SET_SUPERADMIN_USER,
                payload: decoded
            });
            dispatch({
                type: actions.UNSET_SUPERADMIN_USER_LOGIN_LOADER
            });
            // setCurrentUser(decoded)
            history.push('/superadmin/dashboard');
        })
        .catch(error => {
            if (error.response) {
                dispatch({
                    type: actions.SET_SUPERADMIN_USER_LOGIN_ERROR,
                    message: error.response.data.message ? error.response.data.message : error.response.data.error
                });
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                dispatch({
                    type: actions.SET_SUPERADMIN_USER_LOGIN_ERROR,
                    message: error.response.data.message ? error.response.data.message : error.response.data.error
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                dispatch({
                    type: actions.SET_SUPERADMIN_USER_LOGIN_ERROR,
                    message: "Something is wrong with network"
                });
            }
            dispatch({
                type: actions.UNSET_SUPERADMIN_USER_LOGIN_LOADER
            });
        })
}
export const setCurrentAdmin = decoded => {
    return {
        type: actions.SET_SUPERADMIN_USER,
        payload: decoded
    };
};

export const superadminlogout = () => dispatch => {
    localStorage.removeItem('jwtTokenAdmin');

    dispatch({
        type: actions.UNSET_SUPERADMIN_USER
    });
}
