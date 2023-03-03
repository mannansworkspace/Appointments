import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {backendURL} from '@env';
import {  
    SET_CURRENT_USER,
    CLEAR_CURRENT_USER,
    SET_ERROR,
    SET_SID,
    SET_RECOVERY,
} from './types'; 

import {   
    clearPageLoading,
    setPageLoading,
    clearError,
} from './pageActions';






export const loginUser = (userData) => async dispatch => {

    dispatch(setPageLoading());
    try{


        const {data} = await axios.post( backendURL + '/driver/login', userData);
        const {accessToken} = data;
        await AsyncStorage.setItem('jwtToken', accessToken);
        setAuthToken(accessToken);
        const decoded = jwt_decode(accessToken);
        dispatch(setCurrentUser(decoded));
        dispatch(clearError())

        return true
    }
    catch(err){

        dispatch({type: SET_ERROR, payload: err.response.data.message})
        return false
    }
    finally { 
        dispatch(clearPageLoading())
    }
};

export const verifyPhoneEmail = (number, email, navigation) => async dispatch => {
    dispatch(setPageLoading());
    try {
        const res = await axios.post(backendURL + '/driver/verifiy-number', { number, email });

        dispatch({type: SET_SID, payload: res.data})
        dispatch(clearError())

        navigation && navigation.push('Code');
    }
    catch(err){
        dispatch({type: SET_ERROR, payload: err.response.data.message})
    }
    finally { 
        dispatch(clearPageLoading()) 
    }

};

export const signUp = (userData) => async dispatch => {

    dispatch(setPageLoading());
    try{
        const {data} = await axios.post(backendURL + '/driver/signup', userData);
 

        const {accessToken} = data;
        await AsyncStorage.setItem('jwtToken', accessToken);

        setAuthToken(accessToken);
        const decoded = jwt_decode(accessToken);

        dispatch(setCurrentUser(decoded));
        dispatch(clearError())
    }
    catch(err){

        dispatch({type: SET_ERROR, payload: err.response.data.message})
    }
    finally { dispatch(clearPageLoading()) }

};

export const logoutUser = () => dispatch => {
    // dispatch(setNotificationToken(''))

    AsyncStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(clearCurrentUser());
};

export const sendRecoverPasswordEmail = (email , navigation) => async(dispatch) => {
 
    dispatch(setPageLoading());
    await axios.post(
        backendURL+'/driver/recovery-email',
        {email}
    ) 
    .then(res => {
        dispatch({type: SET_RECOVERY, payload:  { email } });
        dispatch(clearError())
        navigation.push('code')
    })
    .catch(err =>{
        dispatch({type: SET_ERROR, payload: err.response.data.message})
    })
    .finally(() => dispatch(clearPageLoading()))
};


export const recoveryCode = (data , navigation) => async(dispatch) => {
 
    dispatch(setPageLoading());

   await axios.post(
        backendURL+'/driver/recovery-code',
        data
    ) 
    .then(res => {
        const { token } = res.data
        dispatch({type: SET_RECOVERY, payload:  { token } });
        dispatch(clearError())
        navigation.push('password')
    })
    .catch(err =>{
        dispatch({type: SET_ERROR, payload: err.response.data.message})
    })
    .finally(() => dispatch(clearPageLoading()))
};


export const resetPassword = (data, verificationToken, navigation) => async dispatch =>{
  
    dispatch(setPageLoading());


    await axios
    .post(
        backendURL+'/driver/change-password', 
        data,
        { headers: { "Authorization": 'Bearer '+ verificationToken } }
    )
    .then(res => {

        navigation.push('success')
    })
    .catch(err => {
        dispatch({type: SET_ERROR, payload: err.response.data.message})
    })
    .finally(() => dispatch(clearPageLoading()));
};








export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const clearCurrentUser = () => {
    return {
		type: CLEAR_CURRENT_USER
	};
};