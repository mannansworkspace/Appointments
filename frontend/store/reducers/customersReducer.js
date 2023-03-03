import {
    CUSTOMERS_LIST,
    GET_CUSTOMERS,
    ADD_CUSTOMER,
    CUSTOMER_EXIST,
    SET_LOADING,
    DELETE_CUSTOMER,
    CUSTOMER_LIMIT,
    EDIT_CUSTOMER,
} from '../actions/types';

const initialState = {
    customers: [],
    customersList: [],
    isCustomerExists: undefined,
    isLoading: true,
    totalCustomers: 0
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
                customers: action.payload.customers,
                totalCustomers: action.payload.total,
                isCustomerExists: undefined,
                isLoading: false
            }
        }

        case ADD_CUSTOMER: {
            const { isExist, customer } = action.payload
            if (isExist) {
                return {
                    ...state,
                    isCustomerExists: isExist,
                    isLoading: false
                }
            }
            else {
                return {
                    ...state,
                    customers: [customer, ...state.customers],
                    isCustomerExists: isExist,
                    isLoading: false
                }
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
        case DELETE_CUSTOMER: {
            return {
                ...state,
                customers: state.customers.filter(
                    (customer) => customer._id !== action.payload
                ),
                totalCustomers: state.totalCustomers - 1,
                isLoading: false,
            }
        }
        case CUSTOMER_LIMIT: {
            const { customer, customerVehicleLimit } = action.payload
            const limit = customerVehicleLimit || null
            return {
                ...state,
                customers: state.customers.map((customerItrator) =>
                    customerItrator._id === customer._id ? {
                        ...customerItrator,
                        customerVehicleLimit: limit
                    } : customerItrator),
                isLoading: false
            }
        }
        case EDIT_CUSTOMER: {
            const { isExist, customers } = action.payload
            if (action.payload.isExist) {
                return {
                    ...state,
                    isCustomerExists: isExist,
                    isLoading: false
                }
            }
            else {
                return {
                    ...state,
                    customers: state.customers.map((customer) =>
                        customer._id === customers._id ? { ...customers, totalAppts: customer.totalAppts, totalCars: customer.totalCars } : customer),
                    isCustomerExists: isExist,
                    isLoading: false
                }

            }
        }
        default:
            return state;
    }
}

export default customersReducer;