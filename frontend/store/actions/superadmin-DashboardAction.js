import axios from 'axios'
import {
    GET_WAREHOUSES_DATA,
    GET_CARRIERS_DATA,
    GET_APPOINTMENTS_DATA,
    DELETE_WAREHOUSE,
    DELETE_CARRIER,
    DELETE_APPOINTMENT,
    GET_CUSTOMERS_DATA
} from './types'

const backendServerURL = process.env.REACT_APP_API_URL;

export const getWarehouseData = (limit, skip) => dispatch => {
    axios.get(backendServerURL + `/superadmin/warehouses/${limit}/${skip}`)
        .then(res => {
            dispatch({
                type: GET_WAREHOUSES_DATA,
                payload: res.data
            });
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const getCarriersData = (limit, skip) => dispatch => {
    
    axios.get(backendServerURL + `/superadmin/carriers/${limit}/${skip}`)
        .then(res => {
            dispatch({
                type: GET_CARRIERS_DATA,
                payload: res.data
            });
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const getAppointmentsData = (limit, skip) => dispatch => {
    
    axios.get(backendServerURL + `/superadmin/appointments/${limit}/${skip}`)
        .then(res => {
            dispatch({
                type: GET_APPOINTMENTS_DATA,
                payload: res.data
            });
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const getCustomersData = (limit, skip) => dispatch => {
    
    axios.get(backendServerURL + `/superadmin/customers/${limit}/${skip}`)
        .then(res => {
            dispatch({
                type: GET_CUSTOMERS_DATA,
                payload: res.data
            });
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const deleteWarehouse = (data) => dispatch => {
    return axios.put(backendServerURL + '/superadmin/delete-warehouse', { id: data })
        .then(res => {
            dispatch({
                type: DELETE_WAREHOUSE,
                payload: res.data
            })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const deleteAppointment = (data) => dispatch => {
    return axios.put(backendServerURL + '/superadmin/delete-appointment', { id: data })
        .then(res => {
            dispatch({
                type: DELETE_APPOINTMENT,
                payload: res.data
            })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}


export const deleteCarrier = (data) => dispatch => {
    return axios.put(backendServerURL + '/superadmin/delete-carrier', { id: data })
        .then(res => {
            dispatch({
                type: DELETE_CARRIER,
                payload: res.data
            })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}
