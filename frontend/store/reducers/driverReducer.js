import {
    GET_SINGLE_APPOINTMENT,
    DISPLAY_CAR_INFORMATION,
    LIST_OF_DRIVER,
    GET_SINGLE_CARRIER,
    CLEAR_SINGLE_APPOINTMENT,
    CLEAR_DISPLAY_INFO
} from '../actions/types';

const initialState = {
    appointmentData: {},
    perDayVehiclesLimit: {},
    bookedAppointments: [],
    displayInform: null,
    driverList: [],
    singleDriver: null,
    isLoading: false
};

const driverReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_SINGLE_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            };
        case CLEAR_DISPLAY_INFO: 
            return {
                ...state,
                displayInform: null
            }
        case GET_SINGLE_APPOINTMENT:
            return {
                ...state,
                appointmentData: action.payload.appointmentData,
                perDayVehiclesLimit: action.payload.perDayVehiclesLimit,
                bookedAppointments: action.payload.bookedAppointments,
                isLoading: false
            };
        case GET_SINGLE_CARRIER:
            return {
                ...state,
                singleDriver: action.payload
            };
        case LIST_OF_DRIVER:
            return {
                ...state,
                driverList: action.payload
            }
        case DISPLAY_CAR_INFORMATION:
            return {
                ...state,
                displayInform: action.payload
            }
        default:
            return state;
    }
}

export default driverReducer;