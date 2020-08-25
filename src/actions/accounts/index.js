import { PORTFOLIO_SOURCE } from "../../commons";

export const ADD_ACCOUNT = "ADD_ACCOUNT";
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
export const REMOVE_ACCOUNT = "REMOVE_ACCOUNT";

export const addEthereumWalletAccount = (name, address) => ({
    type: ADD_ACCOUNT,
    account: {
        type: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
        name,
        address,
    },
});

export const updateEthereumWalletAccount = (name, address) => ({
    type: UPDATE_ACCOUNT,
    account: {
        type: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
        name,
        address,
    },
});

export const removeAccount = (account) => ({
    type: REMOVE_ACCOUNT,
    account,
});
