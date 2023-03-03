import axios from 'axios'
import {
    CUSTOMERS_LIST,
    GET_CUSTOMERS,
    ADD_CUSTOMER,
    CUSTOMER_EXIST,
    SET_LOADING,
    DELETE_CUSTOMER,
    CUSTOMER_LIMIT,
    EDIT_CUSTOMER,
} from './types'


const backendServerURL = process.env.REACT_APP_API_URL;


export const searchCustomer = (data) => async dispatch => {
    try {
        const res = await axios.get(backendServerURL + '/customer/search?name=' + data.name + '&&id=' + data.id)
        dispatch({
            type: CUSTOMERS_LIST,
            payload: res.data
        })
    }
    catch (error) {
        console.log(error.response)
    }
}

export const clearCustomerList = () => dispatch => {
    dispatch({ type: CUSTOMERS_LIST, payload: [] })
}

export const getCustomers = (id, limit=100, skip=0) => async dispatch => {
    try {
        dispatch(setLoading())
        const res = await axios.get(backendServerURL + `/customer/${limit}/${skip}?id=${id}`)
        dispatch({
            type: GET_CUSTOMERS,
            payload: res.data
        })
    }
    catch (error) {
        console.log(error.response)
    }
}

export const limitCustomerVehicle = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        const res = await axios.post(backendServerURL + '/customer/limit', data)
        
        dispatch({
            type: CUSTOMER_LIMIT,
            payload: {
                customer: res.data,
                customerVehicleLimit: data.customerVehicleLimit
            }
        })
    }
    catch (error) {
        console.log(error.response)
    }
}


export const deleteCustomer = (id) => async dispatch => {
    try {
        dispatch(setLoading())
        await axios.delete(backendServerURL + '/customer/' + id)
        dispatch({
            type: DELETE_CUSTOMER,
            payload: id
        })
    }
    catch (error) {
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
            payload: {
                customer: {
                    ...res.data.customers,
                    totalAppts: 0,
                    totalCars: 0
                },
                isExist: res.data.isExist
            }
        })
    }
    catch (error) {
        console.log(error.response)
    }
}

export const editCustomer = (data) => async dispatch => {
    try {
        dispatch(setLoading())
        dispatch(customerExist())
        const res = await axios.post(backendServerURL + '/customer/edit', data)
        dispatch({
            type: EDIT_CUSTOMER,
            payload: res.data

        })
    }
    catch (error) {
        console.log(error.response)
    }
}

export const customerExist = () => dispatch => {
    dispatch({
        type: CUSTOMER_EXIST,

    })
}

export const setLoading = () => dispatch => {
    dispatch({ type: SET_LOADING })
}

