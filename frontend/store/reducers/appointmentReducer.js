import {
    SAVE_APPT,
    ALREADY_BOOK_APPOINTMENT,
    GET_WEEK_DAYS,
    SEARCH_APPOINTMENT_BY_LOT_VIN,
    RESET_SEARCH_APPOINTMENT,
    MARKED_DAY_AS_HOLIDAY,
    REMOVED_DAY_AS_HOLIDAY,
    WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING,
    MARKED_DAY_AS_BLOCKED,
    REMOVED_DAY_AS_BLOCKED,
    DRIVER_BOOKING_WAREHOUSE_DETAILS,
    CLEAR_APPT_DATA,
    CUSTOMERS_LIST,
    SAVE_DRIVER
} from '../actions/types';

const initialState = {
    searchAppointmentsHappening: false,
    searchAppointmentResults: [],
    bookedAppointment: [],
    bookedAppointmentTimeOnly: [],
    weekDays: [],
    isMarkedAsHoliday: false,
    isBlockedFurtherAppointments: false,
    changedTimingsForThisDate: null,
    perDayVehiclesLimit: null,
    extraTimingsForThisDate: [],
    warehouse: {},
    timeSlot: '',
    isLoading: true,
    warehouseLoader: true,
    customers: [],
};

const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_APPT:
            return {
                ...state,
                ...action.payload
            }
        case SAVE_DRIVER: 
            return {
                ...state,
                ...action.payload
            }
        case CLEAR_APPT_DATA:
            return {
                ...state,
                isLoading: true,
            };
        case ALREADY_BOOK_APPOINTMENT:
            return {
                ...state,
                bookedAppointment: (action.payload && action.payload.appointmentsResult) ? action.payload.appointmentsResult : [],
                bookedAppointmentTimeOnly: (action.payload && action.payload.appointmentsResult) ? action.payload.appointmentsResult.map(item => (item.date)) : [],
                isMarkedAsHoliday: action.payload.isMarkedAsHoliday,
                isBlockedFurtherAppointments: action.payload.isBlockedFurtherAppointments,
                changedTimingsForThisDate: action.payload.changedTimingsForThisDate,
                extraTimingsForThisDate: action.payload.extraTimingsForThisDate,
                perDayVehiclesLimit: action.payload.limitVehicles,
                customers: action.payload.customers,
                isLoading: false,
                warehouseLoader: false
            };
        case GET_WEEK_DAYS: {
            return {
                ...state,
                weekDays: action.payload ? action.payload.weekDays : []
            }
        }

        case SEARCH_APPOINTMENT_BY_LOT_VIN: {
            return {
                ...state,
                searchAppointmentsHappening: true,
                searchAppointmentResults: [...action.payload]
            };
        }

        case RESET_SEARCH_APPOINTMENT: {
            return {
                ...state,
                searchAppointmentsHappening: false,
                searchAppointmentResults: []
            }
        }

        case MARKED_DAY_AS_HOLIDAY: {
            return {
                ...state,
                isMarkedAsHoliday: true,
                isLoading: false
            }
        }

        case REMOVED_DAY_AS_HOLIDAY: {
            return {
                ...state,
                isMarkedAsHoliday: false,
                isLoading: false
            }
        }

        case MARKED_DAY_AS_BLOCKED: {
            return {
                ...state,
                isBlockedFurtherAppointments: true,
                isLoading: false
            }
        }

        case REMOVED_DAY_AS_BLOCKED: {
            return {
                ...state,
                isBlockedFurtherAppointments: false,
                isLoading: false
            }
        }

        case WAREHOUSE_APPOINTMENT_DETAILS_FOR_DRIVER_BOOKING: {
            return {
                ...state,
                bookedAppointment: (action.payload && action.payload.appointmentsResult) ? action.payload.appointmentsResult : [],
                bookedAppointmentTimeOnly: (action.payload && action.payload.appointmentsResult) ? action.payload.appointmentsResult.map(item => (item.date)) : [],
                isMarkedAsHoliday: action.payload.isMarkedAsHoliday,
                isBlockedFurtherAppointments: action.payload.isBlockedFurtherAppointments,
                changedTimingsForThisDate: action.payload.changedTimingsForThisDate,
                extraTimingsForThisDate: action.payload.extraTimingsForThisDate,
                perDayVehiclesLimit: action.payload.limitVehicles,
                isLoading: false,
                warehouseLoader: false
            }
        }

        case DRIVER_BOOKING_WAREHOUSE_DETAILS: {
            return {
                ...state,
                warehouse: action.payload.warehouse,
                warehouseLoader: false
            }
        }

        default:
            return state;
    }
}

export default appointmentReducer;