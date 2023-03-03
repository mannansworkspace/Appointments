
import axios from 'axios'
import { 
    CUSTOMERS_LIST,
    GET_CUSTOMERS,
    ADD_CUSTOMER,
    CUSTOMER_EXIST,
    SET_LOADING
} from './types'

const backendServerURL = process.env.backendURL;


export const searchCustomerAction = (data) => async dispatch => {
    try {
        const res = await axios.get(backendServerURL + '/customer/search?name='+data.name+'&&id='+data.id)
        dispatch({
            type: CUSTOMERS_LIST,
            payload: res.data
        })
    }
    catch(error) {
        console.log("in error",error.data)
    }
}

export const clearCustomerList = () => dispatch => {
    dispatch({ type: CUSTOMERS_LIST, payload: [] })
}

export const getCustomers = (id) => async dispatch => {
    try {
        dispatch(setLoading())
        const res = await axios.get(backendServerURL + '/customer?id='+id)
        dispatch({
            type: GET_CUSTOMERS,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error.response)
    }
}

export const limitCustomerVehicle = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        const res = await axios.post(backendServerURL + '/customer/limit', data)
        dispatch({
            type: GET_CUSTOMERS,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error.response)
    }
}

export const removeCustomerLimit = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        const res = await axios.post(backendServerURL + '/customer/removeLimit', data)
        dispatch({
            type: GET_CUSTOMERS,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error.response)
    }
}

export const addCustomer = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        dispatch(customerExist())
        const res = await axios.post(backendServerURL + '/customer', data)
        dispatch({
            type: ADD_CUSTOMER,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error.response)
    }
}

export const editCustomer = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        dispatch(customerExist())
        const res = await axios.post(backendServerURL + '/customer/edit', data)
        dispatch({
            type: ADD_CUSTOMER,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error.response)
    }
}

export const customerExist = () => dispatch => {
    dispatch({type: CUSTOMER_EXIST})
}

export const setLoading = () => dispatch => {
    dispatch({type: SET_LOADING})
}

