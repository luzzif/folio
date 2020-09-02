import {
    GET_COINGECKO_BASE_DATA_END,
    GET_COINGECKO_BASE_DATA_START,
    GET_COINGECKO_BASE_DATA_SUCCESS,
} from "../../actions/coingecko";

const initialState = {
    loadings: 0,
    ids: null,
    wrappedIds: [],
};

export const coinGeckoReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COINGECKO_BASE_DATA_START: {
            return { ...state, loadings: state.loadings + 1 };
        }
        case GET_COINGECKO_BASE_DATA_END: {
            return {
                ...state,
                loadings: state.loadings > 0 ? state.loadings - 1 : 0,
            };
        }
        case GET_COINGECKO_BASE_DATA_SUCCESS: {
            return {
                ...state,
                ids: action.ids,
                wrappedIds: action.wrappedIds,
            };
        }
        default: {
            return state;
        }
    }
};
