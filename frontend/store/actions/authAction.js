import axios from 'axios'
import setAuthToken from '../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import * as actions from './types'
import { NotificationManager } from 'react-notifications';
const backendServerURL = process.env.REACT_APP_API_URL

export const setLoader = (data) => {
    return { type: actions.SET_LOADER, payload: data }
}
export const registerApi = (data, history, user = 'warehouse') => dispatch => {
    dispatch(setLoader(true))
    axios.post(backendServerURL + '/user/register', data)
        .then(res => {
            if (user === 'warehouse') {
                localStorage.setItem('jwtToken', res.data);
                setAuthToken(res.data);
                const decoded = jwt_decode(res.data);
                dispatch(setCurrentUser(decoded, history, '/warehouse', true))
            }
            else {
                history.push('/superadmin')
                NotificationManager.success('Warehouse created Successfully!')
            }
        })
        .catch(err => {
            NotificationManager.error(err.response.data.message)
        })
        .finally(dispatch(setLoader(false)))
}

export const updateUser = (data) => async dispatch => {
    dispatch(setLoader(true))
    axios.post(backendServerURL + '/user/update', data)
        .then(res => {
            dispatch(setLoader(false))
            const decoded = jwt_decode(localStorage.getItem('jwtToken'));
            dispatch(setCurrentUser(decoded))
            NotificationManager.success('Settings Updated Successfully!');
        })
        .catch(err => {
            NotificationManager.error(err.response.data.message);
        })
}

export const loginApi = (data, history, redirectTo = '/warehouse') => dispatch => {
    dispatch(setLoader(true))
    axios.post(backendServerURL + '/user/login', data)
        .then(res => {
            localStorage.setItem('jwtToken', res.data);
            setAuthToken(res.data);
            const decoded = jwt_decode(res.data);
            dispatch(setCurrentUser(decoded, history, redirectTo))
        })
        .catch(error => {
            NotificationManager.error(error && error.response && error.response.data && error.response.data.message)
        })
        .finally(dispatch(setLoader(false)))
}

export const setCurrentUser = (decoded, history = null, redirectTo = null, signUp = false) => async dispatch => {
    const user = decoded.user;

    dispatch({
        type: actions.SET_CURRENT_USER,
        payload: user

    })

    dispatch(getWareHouse(user._id))

    if (history && redirectTo) {
        history.push(redirectTo);
        if (signUp) {
            NotificationManager.success('Sign up Successfully!')
        }
    }

};

export const getWareHouse = (id) => async dispatch => {
    const res = await axios.get(backendServerURL + `/user/getWarehouse/${id}`)

    dispatch({
        type: actions.SET_CURRENT_USER_DATA,
        payload: res.data
    })
}

export const userlogout = () => dispatch => {
    localStorage.removeItem('jwtToken');

    dispatch({
        type: actions.UNSET_CURRENT_USER
    });
}