import axios from 'axios'
import { getCustomers } from './customersAction';
import {
    ALREADY_BOOK_APPOINTMENT, GET_SINGLE_APPOINTMENT, GET_WEEK_DAYS, SEARCH_APPOINTMENT_BY_LOT_VIN, RESET_SEARCH_APPOINTMENT, MARKED_DAY_AS_HOLIDAY, REMOVED_DAY_AS_HOLIDAY
    , WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING, SAVE_APPT, MARKED_DAY_AS_BLOCKED, REMOVED_DAY_AS_BLOCKED, DRIVER_BOOKING_WAREHOUSE_DETAILS,
    CLEAR_APPT_DATA, CLEAR_SINGLE_APPOINTMENT
} from './types'

const backendServerURL = process.env.REACT_APP_API_URL;

export const saveApptData = (data) => dispatch => {
    dispatch({ type: SAVE_APPT, payload: data })
}

export const getAppointmentApi = (date) => dispatch => {
    return axios.get(backendServerURL + '/appointment?date=' + date)
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const removeApptData = () => dispatch => {
    dispatch({ type: CLEAR_APPT_DATA })
}

export const postAppointment = (data) => dispatch => {
    dispatch(removeApptData())
    return axios.post(backendServerURL + '/appointment', data)
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}



export const updateAppointment = (data) => dispatch => {
    dispatch(removeApptData())
    return axios.put(backendServerURL + '/appointment', data)
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}


export const cancelAppointment = (data) => dispatch => {
    dispatch(removeApptData())
    return axios.put(backendServerURL + '/appointment/cancel', data)
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}


export const completeAppointment = (data, history) => dispatch => {
    axios.put(backendServerURL + '/driver/completeAppt', data)
        .then(res => {
            history.push(`/driver-confirm/${res.data._id}`)
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const clearSingleAppt = () => dispatch => {
    dispatch({ type: CLEAR_SINGLE_APPOINTMENT })
}

export const checkedAppointment = (id, vehicles) => dispatch => {
    dispatch(clearSingleAppt())
    return axios.put(backendServerURL + '/appointment/checked', { id: id, vehicles: vehicles })
        .then(res => {
            dispatch({ type: GET_SINGLE_APPOINTMENT, payload: res.data })
            return res.data.checkedStatus
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const getWeeksdays = (id) => dispatch => {
    return axios.get(backendServerURL + '/user/weekdays')
        .then(res => {
            dispatch({ type: GET_WEEK_DAYS, payload: res.data })
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}


export const searchAppointmentsByVinOrLotNumber = query => dispatch => {
    return axios.get(backendServerURL + '/appointment/search?query=' + query)
        .then(res => {
            dispatch({ type: SEARCH_APPOINTMENT_BY_LOT_VIN, payload: res.data });
            return true;
        })
        .catch(err => {
            console.log('Error while searching appointments for vin or lot number ', err);
            return false;
        });
}

export const resetSearchForAppointments = () => dispatch => {
    dispatch({ type: RESET_SEARCH_APPOINTMENT });
    return true;
}




export const markThisDateAsHolidayAction = (date) => dispatch => {
    dispatch(removeApptData())
    dispatch({ type: MARKED_DAY_AS_HOLIDAY, payload: {} });
    return axios.post(backendServerURL + '/appointment/markThisDateAsHoliday', { date: date })
        .then(res => {
            // we actually don't need to dispatch this action 
            // dispatch({ type: MARKED_DAY_AS_HOLIDAY, payload: res.data });
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const removeHolidayAction = (date) => dispatch => {
    dispatch(removeApptData())
    dispatch({ type: REMOVED_DAY_AS_HOLIDAY, payload: {} });
    return axios.post(backendServerURL + '/appointment/removeHoliday', { date: date })
        .then(res => {
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        });
}


export const blockedThisDateAction = (date) => dispatch => {
    dispatch(removeApptData())
    dispatch({ type: MARKED_DAY_AS_BLOCKED, payload: {} });
    return axios.post(backendServerURL + '/appointment/blockThisDay', { date: date })
        .then(res => {
            // we actually don't need to dispatch this action 
            // dispatch({ type: MARKED_DAY_AS_HOLIDAY, payload: res.data });
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        })
}

export const removeBlockedAction = (date) => dispatch => {
    dispatch(removeApptData())
    dispatch({ type: REMOVED_DAY_AS_BLOCKED, payload: {} });
    return axios.post(backendServerURL + '/appointment/removeBlockDay', { date: date })
        .then(res => {
            return true
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        });
}




export const changeDayTimings = (new_timings, date) => dispatch => {
    dispatch(removeApptData())
    axios.post(backendServerURL + '/appointment/changeDayTimings', { from_time: new_timings.fromTime, to_time: new_timings.toTime, date: date })
        .then(res => {
            dispatch({
                type: ALREADY_BOOK_APPOINTMENT,
                payload: res.data
            })
        })
        .catch(err => {
            console.log('err', err.message)
        })
}




export const addExtraTimeSlotOnDay = (date, time_slot) => dispatch => {
    dispatch(removeApptData())

    return axios.post(backendServerURL + '/appointment/addExtraTimeSlotOnDay', { date: date, time_slot: time_slot })
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true;
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        });
}


export const removeExtraTimeSlotOnDay = (date, id) => dispatch => {
    dispatch(removeApptData())
    return axios.post(backendServerURL + '/appointment/remvoeExtraTimeSlotOnDay', { date: date, id: id })
        .then(res => {
            dispatch({ type: ALREADY_BOOK_APPOINTMENT, payload: res.data })
            return true;
        })
        .catch(err => {
            console.log('err', err.message)
            return false
        });
}



export const getWarehouseAppointmentDetailsByDomainName = (warehouse_domain, date, history) => dispatch => {

    axios.get(backendServerURL + '/appointment/getWarehouseAppointmentDetailsByDomainName?warehouse_domain=' + warehouse_domain + '&date=' + date)
        .then(res => {
            if (res.data?.warehouse?._id) {
                dispatch(getCustomers(res.data.warehouse._id))
            }
            dispatch({
                type: date ? WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING : DRIVER_BOOKING_WAREHOUSE_DETAILS,
                payload: res.data
            });
        })
        .catch(err => {
            history.push('/404')
        });
}

export const setVehicleLimitForADay = (date, vehiclesPerDay, vehiclesPerSlot) => async dispatch => {
    dispatch(removeApptData())
    try {
        const res = await axios.post(backendServerURL + '/appointment/perDayLimit', { date: date, vehiclesPerDay: vehiclesPerDay, vehiclesPerSlot: vehiclesPerSlot })
        dispatch({
            type: ALREADY_BOOK_APPOINTMENT,
            payload: res.data
        })
    }
    catch (error) {
        console.log(error.response)
    }
}


export const removeVehicleLimitForADay = (date, id) => async dispatch => {
    try {
        dispatch(removeApptData())
        const res = await axios.post(backendServerURL + '/appointment/removePerDayLimit', { date: date, id: id })
        dispatch({
            type: ALREADY_BOOK_APPOINTMENT,
            payload: res.data
        })
    }
    catch (error) {
        console.log(error.response)
    }
}
