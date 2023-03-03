import {
    CUSTOMERS_LIST,
    GET_CUSTOMERS,
    ADD_CUSTOMER,
    CUSTOMER_EXIST,
    SET_LOADING
} from '../actions/types';

const initialState = {
    customers: [],
    customersList: [],
    isCustomerExists: undefined,
    isLoading: true
};

const customersReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }

        case CUSTOMER_EXIST: {
            return {
                ...state,
                isCustomerExists: undefined
            }
        }


        case GET_CUSTOMERS: {
            return {
                ...state,
                customers: action.payload,
                isCustomerExists: undefined,
                isLoading: false
            }
        }

        case ADD_CUSTOMER: {
            return {
                ...state,
                customers: action.payload.customers,
                isCustomerExists: action.payload.isExist,
                isLoading: false
            }
        }

        case CUSTOMERS_LIST: {
            return {
                ...state,
                customersList: action.payload,
                isCustomerExists: undefined,
                isLoading: false
            }
        }

        default:
            return state;
    }
}

export default customersReducer;