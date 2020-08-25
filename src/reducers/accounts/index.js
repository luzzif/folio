import {
    ADD_ACCOUNT,
    REMOVE_ACCOUNT,
    UPDATE_ACCOUNT,
} from "../../actions/accounts";
import { PORTFOLIO_SOURCE } from "../../commons";

export const accountsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_ACCOUNT: {
            return [...state, action.account];
        }
        case REMOVE_ACCOUNT: {
            return [...state.filter((account) => account !== action.account)];
        }
        case UPDATE_ACCOUNT: {
            const updatedAccountIndex = state.findIndex(
                getUpdatePredicate(action.account)
            );
            if (updatedAccountIndex >= 0) {
                state[updatedAccountIndex] = action.account;
                return [...state];
            }
            return state;
        }
        default: {
            return state;
        }
    }
};

const getUpdatePredicate = (updatedAccount) => {
    switch (updatedAccount.type) {
        case PORTFOLIO_SOURCE.ETHEREUM_WALLET: {
            return (account) => account.address === updatedAccount.address;
        }
    }
};
