import {
    CREATE_PIN,
    DISABLE_PIN,
    TRIGGER_PIN_VERIFY,
    VERIFY_PIN,
} from "../../actions/pin";

export const initialState = {
    pin: "",
    isVerified: false,
    isEnabled: false,
    isVerifying: false,
};

export const pinReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PIN: {
            return { ...state, pin: action.pin, isEnabled: true, isVerifying: false };
        }
        case TRIGGER_PIN_VERIFY: {
            return { ...state, isVerifying: true, isVerified: false }
        }
        case DISABLE_PIN: {
            return { ...state, isEnabled: false, isVerifying: false };
        }
        case VERIFY_PIN: {
            return { ...state, isVerified: action.isVerified }
        }
        default: {
            return state;
        }
    }
};
