import * as actions from '../actions/types';

const initialState = {
    warehouseDetail: null
};

const warehouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_SINGLE_WAREHOUSE:
            return {
                ...state,
                warehouseDetail: action.payload
            };
        default:
            return state;
    }
}

export default warehouseReducer;
