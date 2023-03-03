import { 
    GET_ALL_APPOINTMENTS, 
    GET_SINGLE_APPOINTMENT, 
    GET_WAREHOUSES,
    WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING,
    DISPLAY_CAR_INFORMATION,
    CLEAR_SINGLE_APPOINTMENT,
    CAR_EXIST_ERROR
} from '../actions/types';

const initialState = {
    appointments: [],
    appointment: null,
    warehouses: [],
    bookedAppointment: [],
    bookedAppointmentTimeOnly: [],
    weekDays: [],
    isMarkedAsHoliday: false,
    isBlockedFurtherAppointments: false,
    changedTimingsForThisDate: null,
    perDayVehiclesLimit: null,
    extraTimingsForThisDate: [],
    warehouse: null,
    displayInform: null,
    carExists : false,
    warehouseVehiclesLimit : null
}

const appointmentReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_ALL_APPOINTMENTS:
            return {
                ...state,
                appointments: payload
            };
        case GET_SINGLE_APPOINTMENT:
            return {
                ...state,
                appointment: payload
            };
        case CLEAR_SINGLE_APPOINTMENT:
            return {
                ...state,
                appointment: null
            }
        case GET_WAREHOUSES:
            return {
                ...state,
                warehouses: payload.warehouses
            };
        case CAR_EXIST_ERROR:
            return {
                ...state,
                carExists : payload
            }
        case WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING:
            const {warehouse , limitVehicles} = payload
            const {vehiclesLimit} = warehouse
            return {
                ...state,
                warehouse: payload.warehouse,
                bookedAppointment: (payload.appointmentsResult) ? payload.appointmentsResult : [],
                bookedAppointmentTimeOnly: ( payload.appointmentsResult) ? payload.appointmentsResult.map(item => (item.date)) : [],
                isMarkedAsHoliday: payload.isMarkedAsHoliday,
                isBlockedFurtherAppointments: payload.isBlockedFurtherAppointments,
                changedTimingsForThisDate: payload.changedTimingsForThisDate,
                extraTimingsForThisDate: payload.extraTimingsForThisDate,
                perDayVehiclesLimit: limitVehicles,
                warehouseVehiclesLimit : vehiclesLimit
            };
        case DISPLAY_CAR_INFORMATION:
            return {
                ...state,
                displayInform: action.payload
            }
        default:
            return state;
    }
}

export default appointmentReducer;