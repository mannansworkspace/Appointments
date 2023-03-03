import axios from 'axios'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import { clearSingleAppt } from './appointmentAction'
import { getCustomers } from './customersAction'
import {
    GET_SINGLE_APPOINTMENT,
    DISPLAY_CAR_INFORMATION,
    LIST_OF_DRIVER,
    SAVE_APPT,
    SAVE_DRIVER,
    CLEAR_DISPLAY_INFO
} from './types'
const backendServerURL = process.env.REACT_APP_API_URL

export const clearDisplayInform = () => dispatch => {
    dispatch({
        type: CLEAR_DISPLAY_INFO
    })
}

export const getSingleAppointment = (id) => dispatch => {
    dispatch(clearSingleAppt())
    return axios.get(backendServerURL + '/appointment/detail?id=' + id)
        .then(res => {
            dispatch(getCustomers(res.data.appointmentData.warehouse_id._id))
            dispatch({ type: GET_SINGLE_APPOINTMENT, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
        })
}

export const verifyInformationByDriver = (data) => dispatch => {

    axios.post(backendServerURL + '/driver', data)
        .then(res => {
            // history.push(`/driver-detail/${res.data._id}`)
            dispatch({
                type: SAVE_DRIVER,
                payload: data
            })
        })
        .catch(err => {
            console.log("verfiy Vehicle")
            console.log('err', err.message)
        })
}

export const fetchCarInformation = (value, type) => dispatch => {
    return axios.get(backendServerURL + '/driver?data=' + value + "&type=" + type)
        .then(res => {
            if (res.data.isVehicleExist) {
                dispatch({ type: DISPLAY_CAR_INFORMATION, payload: res.data })
                NotificationManager.error("", "Vehicle with this vin/lot already exists, duplicate appointments are not allowed")

            }
            else {
                dispatch({ type: DISPLAY_CAR_INFORMATION, payload: res.data })
                return true
            }

        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}


export const resetCarInformation = () => dispatch => {
    dispatch({ type: DISPLAY_CAR_INFORMATION, payload: null })
}

export const getDriver = (search) => dispatch => {
    axios.get(backendServerURL + '/driver/search?search=' + search)
        .then(res => {
            dispatch({ type: LIST_OF_DRIVER, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const clearDriverList = () => dispatch => {
    dispatch({ type: LIST_OF_DRIVER, payload: [] })
}

export const cancelDriverAppointment = (appointmentDetails)=>async(dispatch) =>{
    try{
        await axios.put(backendServerURL + '/driver/cancel-appointment',appointmentDetails)
        return true
    }
    catch(error){
        console.log('err', error.message)
        return false
    }
}