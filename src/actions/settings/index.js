export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";

export const toggleDarkMode = () => ({
    type: TOGGLE_DARK_MODE,
});

export const CHANGE_FIAT_CURRENCY = "CHANGE_FIAT_CURRENCY";

export const changeFiatCurrency = (currency) => ({
    type: CHANGE_FIAT_CURRENCY,
    currency,
});
