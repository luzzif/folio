import { ToastAndroid } from "react-native";
import { getInfoFromCoinGecko, isCoinDismissedBasedOnInfo } from "../../utils";

export const ADD_MANUAL_TRANSACTION = "ADD_MANUAL_TRANSACTION";

export const addManualTransaction = (
    symbol,
    buy,
    balance,
    coinGeckoId,
    fiatCurrency
) => async (dispatch) => {
    try {
        const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
        if (isCoinDismissedBasedOnInfo(info)) {
            ToastAndroid.show(
                "The coin is not valid. Maybe it was dismissed?",
                5000
            );
            return;
        }
        dispatch({
            type: ADD_MANUAL_TRANSACTION,
            transaction: {
                timestamp: Date.now(),
                symbol,
                balance: balance,
                buy,
                coinGeckoId,
            },
        });
    } catch (error) {
        console.error("error adding the manual transaction", error);
        ToastAndroid.show(
            "There was an error adding the manual transaction.",
            5000
        );
    }
};

export const REMOVE_MANUAL_TRANSACTION = "REMOVE_MANUAL_TRANSACTION";

export const removeManualTransaction = (transaction) => ({
    type: REMOVE_MANUAL_TRANSACTION,
    transaction,
});
