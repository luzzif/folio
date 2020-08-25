import { TOGGLE_DARK_MODE, CHANGE_FIAT_CURRENCY } from "../../actions/settings";

export const initialState = {
    darkMode: false,
    fiatCurrency: "eur",
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_DARK_MODE: {
            return { ...state, darkMode: !state.darkMode };
        }
        case CHANGE_FIAT_CURRENCY: {
            return { ...state, fiatCurrency: action.currency };
        }
        default: {
            return state;
        }
    }
};
