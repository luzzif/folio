import { ToastAndroid } from "react-native";

export const GET_COINGECKO_BASE_DATA_START = "GET_COINGECKO_BASE_DATA_START";
export const GET_COINGECKO_BASE_DATA_END = "GET_COINGECKO_BASE_DATA_END";
export const GET_COINGECKO_BASE_DATA_SUCCESS =
    "GET_COINGECKO_BASE_DATA_SUCCESS";

export const getCoinGeckoBaseData = (fiatCurrency) => async (dispatch) => {
    dispatch({ type: GET_COINGECKO_BASE_DATA_START });
    try {
        let response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${fiatCurrency}&per_page=200&page=1`
        );
        const markets = await response.json();
        response = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const rawIds = await response.json();
        dispatch({
            type: GET_COINGECKO_BASE_DATA_SUCCESS,
            ids: rawIds.reduce((ids, rawId) => {
                ids[rawId.symbol.toLowerCase()] = rawId.id;
                return ids;
            }, {}),
            markets,
        });
    } catch (error) {
        console.error("error getting coingecko base data");
        ToastAndroid.show("An error occurred. Please try again later", 5000);
    } finally {
        dispatch({ type: GET_COINGECKO_BASE_DATA_END });
    }
};
