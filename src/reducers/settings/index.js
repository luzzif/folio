import {
    TOGGLE_DARK_MODE,
    CHANGE_FIAT_CURRENCY,
    CHANGE_PERCENTAGE_CHANGE_TIMEFRAME,
} from "../../actions/settings";

export const initialState = {
    darkMode: false,
    fiatCurrency: "eur",
    percentageChangeTimeframe: "1d",
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_DARK_MODE: {
            return { ...state, darkMode: !state.darkMode };
        }
        case CHANGE_FIAT_CURRENCY: {
            return { ...state, fiatCurrency: action.currency };
        }
        case CHANGE_PERCENTAGE_CHANGE_TIMEFRAME: {
            return { ...state, percentageChangeTimeframe: action.timeframe };
        }
        default: {
            return state;
        }
    }
};
