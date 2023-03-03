import axios from 'axios'
import {
    GET_SINGLE_WAREHOUSE,
    GET_SINGLE_CARRIER,
    UPDATE_WAREHOUSE,
    UPDATE_CARRIER
} from './types'
const backendServerURL = process.env.REACT_APP_API_URL

export const getSingleWarehouse = (id) => dispatch => {
    return axios.get(backendServerURL + '/user/detail?id=' + id)
        .then(res => {

            dispatch({ type: GET_SINGLE_WAREHOUSE, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const updateWarehouse = (data, history) => dispatch => {
    axios.put(backendServerURL + "/superadmin/update-warehouse", data)
        .then(res => {
            dispatch({
                type: UPDATE_WAREHOUSE,
                payload: res.data
            })
            history.push('/superadmin/dashboard')
        })
        .catch(err => {
            console.log('err', err.message)
        })
}


export const getSingleCarrier = (id) => dispatch => {
    return axios.get(backendServerURL + '/driver/detail?id=' + id)
        .then(res => {
            dispatch({ type: GET_SINGLE_CARRIER, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const updateCarrier = (data, history) => dispatch => {
    axios.put(backendServerURL + "/superadmin/update-carrier", data)
        .then(res => {
            dispatch({
                type: UPDATE_CARRIER,
                payload: res.data
            })
            history.push('/superadmin/dashboard')
        })
        .catch(err => {
            console.log('err', err.message)
        })
}