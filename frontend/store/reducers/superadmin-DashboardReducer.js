import {  
    GET_WAREHOUSES_DATA,
    GET_CARRIERS_DATA,
    GET_APPOINTMENTS_DATA,
    DELETE_APPOINTMENT,
    DELETE_CARRIER,
    DELETE_WAREHOUSE,
    UPDATE_WAREHOUSE,
    UPDATE_CARRIER,
    GET_CUSTOMERS_DATA
} from '../actions/types';

const initialState = {
    warehouses: [],
    carriers: [],
    appointments: [],
    customers: [],
    loading: true,
    totalWarehouses: 0,
    totalCarriers: 0,
    totalAppts: 0,
    totalCustomers: 0,
};

const superAdminDashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WAREHOUSES_DATA:
            return {
                ...state,
                warehouses: action.payload.warehouses,
                totalWarehouses: action.payload.total,
                loading: false,
                carriers: [],
                appointments: [],
                customers: [],
                totalCustomers:0,
                totalCarriers: 0,
                totalAppts: 0,
            };
        case GET_CARRIERS_DATA:
            return {
                ...state,
                carriers: action.payload.carriers,
                totalCarriers: action.payload.total,
                loading: false,
                warehouses: [],
                totalWarehouses: 0,
                appointments: [],
                totalAppts: 0,
                customers: [],
                totalCustomers:0,
            };
        case GET_APPOINTMENTS_DATA:
            return {
                ...state,
                appointments: action.payload.appointments,
                totalAppts: action.payload.total,
                loading: false,
                warehouses: [],
                carriers: [],
                totalWarehouses: 0,
                totalCarriers: 0,
                customers: [],
                totalCustomers:0,
            };

        case GET_CUSTOMERS_DATA:
            return {
                ...state,
                customers: action.payload.customers,
                totalCustomers: action.payload.total,
                loading: false,
                warehouses: [],
                carriers: [],
                appointments: [],
                totalAppts: 0,
                totalWarehouses: 0,
                totalCarriers: 0,
            };
        case DELETE_WAREHOUSE:
            return {
                ...state,
                warehouses: state.warehouses.filter(item => item._id !== action.payload),
                totalWarehouses: state.totalWarehouses - 1,
                loading: false,
            };
        case DELETE_CARRIER:
            return {
                ...state,
                carriers: state.carriers.map(item => item._id === action.payload._id ? action.payload : item),
                loading: false,
            };
        case DELETE_APPOINTMENT:
            return {
                ...state,
                appointments: state.appointments.filter(item => item._id !== action.payload),
                totalAppts: state.totalAppts - 1,
                loading: false,
            };
        case UPDATE_WAREHOUSE:
            return {
                ...state,
                warehouses: state.warehouses.map(item => item._id === action.payload._id ? action.payload : item),
                loading: false,
            };
        case UPDATE_CARRIER:
            return {
                ...state,
                carriers: state.carriers.map(item => item._id === action.payload._id ? action.payload : item),
                loading: false,
            };
        default:
            return state;
    }
}

export default superAdminDashboardReducer;