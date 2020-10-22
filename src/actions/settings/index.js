export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";

export const toggleDarkMode = () => ({
    type: TOGGLE_DARK_MODE,
});

export const CHANGE_FIAT_CURRENCY = "CHANGE_FIAT_CURRENCY";

export const changeFiatCurrency = (currency) => ({
    type: CHANGE_FIAT_CURRENCY,
    currency,
});

export const CHANGE_PERCENTAGE_CHANGE_TIMEFRAME =
    "CHANGE_PERCENTAGE_CHANGE_TIMEFRAME";

export const changePercentageChangeTimeframe = (timeframe) => ({
    type: CHANGE_PERCENTAGE_CHANGE_TIMEFRAME,
    timeframe,
});

export const IMPORT_SETTINGS = "IMPORT_SETTINGS";

export const importSettings = (settings) => ({
    type: IMPORT_SETTINGS,
    settings,
});
