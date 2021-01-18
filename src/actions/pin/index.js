import { sha256 } from "../../utils"

export const CREATE_PIN = "CREATE_PIN";

export const createPin = (pin) => {
    return {
        type: CREATE_PIN,
        pin: sha256(pin),
    }
};

export const DISABLE_PIN = "DISABLE_PIN";

export const disablePin = () => {
    return {
        type: DISABLE_PIN,
    }
};

export const TRIGGER_PIN_VERIFY = "TRIGGER_PIN_VERIFY";

export const triggerPinVerify = () => {
    return {
        type: TRIGGER_PIN_VERIFY,
    }
};

export const VERIFY_PIN = "VERIFY_PIN";

export const verifyPin = (isVerified) => ({
    type: VERIFY_PIN,
    isVerified,
});