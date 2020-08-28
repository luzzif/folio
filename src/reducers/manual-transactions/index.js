import {
    ADD_MANUAL_TRANSACTION,
    REMOVE_MANUAL_TRANSACTION,
    UPDATE_MANUAL_TRANSACTION,
} from "../../actions/manual-transaction";

export const manualTransactionsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_MANUAL_TRANSACTION: {
            return [...state, action.transaction];
        }
        case UPDATE_MANUAL_TRANSACTION: {
            const updatedTransactionIndex = state.findIndex(
                (account) => account.timestamp === action.transaction.timestamp
            );
            if (updatedTransactionIndex >= 0) {
                state[updatedTransactionIndex] = action.transaction;
                return [...state];
            }
            return state;
        }
        case REMOVE_MANUAL_TRANSACTION: {
            return state.filter(
                (transaction) => transaction !== action.transaction
            );
        }
        default: {
            return state;
        }
    }
};
