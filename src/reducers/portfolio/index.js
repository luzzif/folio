import {
    GET_PORTFOLIO_START,
    GET_PORTFOLIO_END,
    GET_PORTFOLIO_SUCCESS,
    RESET_PORTFOLIO,
} from "../../actions/portfolio";

export const initialState = {
    loadings: 0,
    timestamp: Date.now(),
    data: [],
};

export const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PORTFOLIO_START: {
            return { ...state, loadings: state.loadings + 1 };
        }
        case GET_PORTFOLIO_END: {
            return {
                ...state,
                loadings: state.loadings > 0 ? state.loadings - 1 : 0,
            };
        }
        case GET_PORTFOLIO_SUCCESS: {
            return {
                ...state,
                timestamp: action.timestamp,
                data: action.portfolio,
            };
        }
        case RESET_PORTFOLIO: {
            return { ...initialState };
        }
        default: {
            return state;
        }
    }
};
