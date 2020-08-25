import { TOGGLE_DARK_MODE } from "../../actions/settings";

export const initialState = {
    darkMode: false,
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_DARK_MODE: {
            return { ...state, darkMode: !state.darkMode };
        }
        default: {
            return state;
        }
    }
};
