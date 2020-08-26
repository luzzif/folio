import { ToastAndroid } from "react-native";

export const GET_COINGECKO_COIN_IDS_START = "GET_COINGECKO_COIN_IDS_START";
export const GET_COINGECKO_COIN_IDS_END = "GET_COINGECKO_COIN_IDS_END";
export const GET_COINGECKO_COIN_IDS_SUCCESS = "GET_COINGECKO_COIN_IDS_SUCCESS";

export const getCoinGeckoIds = () => async (dispatch) => {
    dispatch({ type: GET_COINGECKO_COIN_IDS_START });
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/list"
        );
        const rawCoins = await response.json();
        dispatch({
            type: GET_COINGECKO_COIN_IDS_SUCCESS,
            ids: rawCoins.reduce((accumulator, rawCoin) => {
                accumulator[rawCoin.symbol.toLowerCase()] = rawCoin.id;
                return accumulator;
            }, {}),
        });
    } catch (error) {
        console.error("error getting coingecko coin ids");
        ToastAndroid.show("An error occurred. Please try again later", 5000);
    } finally {
        dispatch({ type: GET_COINGECKO_COIN_IDS_END });
    }
};
