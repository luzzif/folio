export const GET_PRICES_START = "GET_PRICES_START";
export const GET_PRICES_END = "GET_PRICES_TEND";
export const GET_PRICES_SUCCESS = "GET_PRICES_SUCCESS";

export const getPrices = (symbols, currency) => async (dispatch) => {
    dispatch({ type: GET_PRICES_START });
    try {
        const uppercaseCurrency = currency.toUpperCase();
        const response = await fetch(
            `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols
                .map((symbol) => symbol.toUpperCase())
                .join(",")}&tsyms=${uppercaseCurrency}`
        );
        const json = await response.json();
        dispatch({
            type: GET_PRICES_SUCCESS,
            prices: Object.entries(json).reduce((prices, [key, value]) => {
                prices[key] = value[uppercaseCurrency];
                return prices;
            }, {}),
        });
    } catch (error) {
        console.error("error getting prices", error);
    } finally {
        dispatch({ type: GET_PRICES_END });
    }
};
