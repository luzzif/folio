import {
    GET_PORTFOLIO_START,
    GET_PORTFOLIO_END,
    GET_PORTFOLIO_SUCCESS,
    RESET_PORTFOLIO,
} from "../../actions/portfolio";

export const initialState = {
    loadings: 0,
    data: [],
};

export const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PORTFOLIO_START: {
            return { ...state, loadings: state.loadings + 1 };
        }
        case GET_PORTFOLIO_END: {
            return { ...state, loadings: state.loadings - 1 };
        }
        case GET_PORTFOLIO_SUCCESS: {
            return {
                ...state,
                data: [...state.data, ...action.portfolio],
            };
        }
        case RESET_PORTFOLIO: {
            return { ...state, data: [] };
        }
        default: {
            return state;
        }
    }
};
