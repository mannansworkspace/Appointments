import axios from 'axios';
import { backendURL } from '@env';
import {
    GET_ALL_APPOINTMENTS,
    GET_SINGLE_APPOINTMENT,
    GET_WAREHOUSES,
    WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING,
    DISPLAY_CAR_INFORMATION,
    CLEAR_SINGLE_APPOINTMENT,
    CAR_EXIST_ERROR
} from './types';

import { setPageLoading, clearPageLoading } from './pageActions';


export const createAppointment = (newAppointment) => dispatch => {
    // dispatch(setPageLoading())
    dispatch({
        type: GET_SINGLE_APPOINTMENT,
        payload: newAppointment
    })
    // dispatch(clearPageLoading())
}

export const getAllApoointmentsForDebounce = (search = '') => async dispatch => {

    try {
        const { data } = await axios.get(backendURL + `/driver/appointments/?search=${search}`);
        dispatch({
            type: GET_ALL_APPOINTMENTS,
            payload: data
        })
    }
    catch (err) {
        console.log(err);
    }
}



export const getAllApoointments = (search = '') => async dispatch => {
    dispatch(setPageLoading())

    try {

        const { data } = await axios.get(backendURL + `/driver/appointments/?search=${search}`);
        dispatch({
            type: GET_ALL_APPOINTMENTS,
            payload: data
        })
    }
    catch (err) {
        console.log(err);
    }
    finally { dispatch(clearPageLoading()) }
}

export const getSingleAppointment = (id) => async dispatch => {
    console.log("getting single appt")
    dispatch(setPageLoading())
    try {
        const { data } = await axios.get(backendURL + '/appointment/detail?id=' + id)
        dispatch({
            type: GET_SINGLE_APPOINTMENT,
            payload: data.appointmentData
        })
    } catch (err) {
        console.log('err', err.message)
    }
    finally { dispatch(clearPageLoading()) }

}

export const getWarehouses = () => async dispatch => {
    dispatch(setPageLoading())

    try {

        const { data } = await axios.get(backendURL + '/superadmin/warehouses/200/0');

        dispatch({
            type: GET_WAREHOUSES,
            payload: data
        })

        dispatch(clearPageLoading())
    } catch (err) {
        console.log(err);
    }
}


export const getWarehouseDetails = (warehouse_domain, date) => async dispatch => {
    dispatch(setPageLoading())

    try {
        const { data } = await axios.get(backendURL + '/appointment/getWarehouseAppointmentDetailsByDomainName?warehouse_domain=' + warehouse_domain + '&date=' + date)
        dispatch({
            type: WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING,
            payload: data
        });
    }
    catch (err) {
        console.log(err);
    }
    finally { dispatch(clearPageLoading()) }
}


export const fetchCarInformation = (value, key, type) => async dispatch => {

     return ( axios.get(backendURL + '/driver?data=' + value + "&type=" + type))
        .then(res => {
            const {data} = res

            if(data.isVehicleExist){
                dispatch(setCarEXistError(true))
                return 
            }
            dispatch({ type: DISPLAY_CAR_INFORMATION, payload: { ...data, key } })
            return true
        })
        .catch(err => {
            return false
        })
}


export const resetCarInformation = () => dispatch => {
    dispatch({ type: DISPLAY_CAR_INFORMATION, payload: null })
}

export const completeAppointment = (appointment) => async dispatch => {
    dispatch(setPageLoading())
    try {

        const {onlineBooked , customerId , customerName} = appointment
        const customer = onlineBooked ? customerName : customerId.customerName
        const { data } = await axios.put(backendURL + '/driver/completeAppt', {
            ...appointment,
            customerName : customer,
            mobileFilledAppointment : true
        })
        dispatch({
            type: GET_SINGLE_APPOINTMENT,
            payload: data
        })
    } catch (error) {
        console.log("error : ", error)
    }
    finally { dispatch(clearPageLoading()) }
}

export const clearSingleAppt = () => dispatch => {
    dispatch({ type: CLEAR_SINGLE_APPOINTMENT })
}

export const setCarEXistError = (isCarExist) => dispatch =>{
    dispatch({
        type : CAR_EXIST_ERROR,
        payload : isCarExist
    })
}

export const cancelAppointment = (detail) =>async(dispatch) =>{
    try{
        const data = {
            id: detail._id,
            name: detail.company_name,
            time: detail.time_slot,
            date: detail.date,
        }
        await axios.put(backendURL + '/driver/cancel-appointment' , data)
        return true

    }catch(error){
        console.log(error)
        return false
    }
}