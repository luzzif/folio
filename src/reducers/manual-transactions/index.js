import {
    ADD_MANUAL_TRANSACTION,
    REMOVE_MANUAL_TRANSACTION,
} from "../../actions/manual-transaction";

export const manualTransactionsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_MANUAL_TRANSACTION: {
            return [...state, action.transaction];
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
