import {
    ADD_ACCOUNT,
    REMOVE_ACCOUNT,
    UPDATE_ACCOUNT,
} from "../../actions/accounts";

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
                (account) => account.id === action.account.id
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
