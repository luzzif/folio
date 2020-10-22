import { ToastAndroid } from "react-native";

export const ADD_MANUAL_TRANSACTION = "ADD_MANUAL_TRANSACTION";

export const addManualTransaction = (
    symbol,
    buy,
    balance,
    coinGeckoId
) => async (dispatch) => {
    try {
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

export const UPDATE_MANUAL_TRANSACTION = "UPDATE_MANUAL_TRANSACTION";

export const updateManualTransaction = (
    timestamp,
    symbol,
    balance,
    buy,
    coinGeckoId
) => ({
    type: UPDATE_MANUAL_TRANSACTION,
    transaction: {
        timestamp,
        symbol,
        balance,
        buy,
        coinGeckoId,
    },
});

export const REMOVE_MANUAL_TRANSACTION = "REMOVE_MANUAL_TRANSACTION";

export const removeManualTransaction = (transaction) => ({
    type: REMOVE_MANUAL_TRANSACTION,
    transaction,
});

export const IMPORT_MANUAL_TRANSACTIONS = "IMPORT_MANUAL_TRANSACTIONS";

export const importManualTransactions = (transactions) => ({
    type: IMPORT_MANUAL_TRANSACTIONS,
    transactions,
});
