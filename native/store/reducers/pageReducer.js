import {
	PAGE_LOADING,
	PAGE_LOADED,
} from '../actions/types';

const initialState = {
	loading: false,
	offeredOrders : [],
	activeOrders : [],
	pastOrders:[],
	alerts : [],
	alert : {}
};

const pageReducer = (state = initialState, action) => {
    const{type, payload} = action;
    if(type === PAGE_LOADING){
        return {
            ...state,
            loading: true
        };
    }

    if(type === PAGE_LOADED){
        return{
            ...state,
            loading: false
        };
    }
    
    return state;
}

export default pageReducer;
