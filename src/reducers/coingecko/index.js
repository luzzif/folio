import {
    GET_COINGECKO_COIN_IDS_END,
    GET_COINGECKO_COIN_IDS_START,
    GET_COINGECKO_COIN_IDS_SUCCESS,
} from "../../actions/coingecko";

const initialState = {
    loadings: 0,
    ids: null,
    assetOptions: [],
};

export const coinGeckoReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COINGECKO_COIN_IDS_START: {
            return { ...state, loadings: state.loadings + 1 };
        }
        case GET_COINGECKO_COIN_IDS_END: {
            return {
                ...state,
                loadings: state.loadings > 0 ? state.loadings - 1 : 0,
            };
        }
        case GET_COINGECKO_COIN_IDS_SUCCESS: {
            return {
                ...state,
                ids: action.ids,
                assetOptions: action.assetOptions,
            };
        }
        default: {
            return state;
        }
    }
};
