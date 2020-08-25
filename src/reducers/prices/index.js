import {
    GET_PRICES_START,
    GET_PRICES_END,
    GET_PRICES_SUCCESS,
} from "../../actions/prices";

export const initialState = {
    loadings: 0,
    data: {},
};

export const pricesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRICES_START: {
            return { ...state, loadings: state.loadings + 1 };
        }
        case GET_PRICES_END: {
            return { ...state, loadings: state.loadings - 1 };
        }
        case GET_PRICES_SUCCESS: {
            return {
                ...state,
                data: action.prices,
            };
        }
        default: {
            return state;
        }
    }
};
