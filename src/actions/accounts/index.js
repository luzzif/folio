export const ADD_ACCOUNT = "ADD_ACCOUNT";
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
export const REMOVE_ACCOUNT = "REMOVE_ACCOUNT";

export const addAccount = (name, type, fields) => ({
    type: ADD_ACCOUNT,
    account: {
        id: Date.now(),
        type,
        name,
        fields,
    },
});

export const updateAccount = (id, name, type, fields) => ({
    type: UPDATE_ACCOUNT,
    account: {
        id,
        name,
        type,
        fields,
    },
});

export const removeAccount = (account) => ({
    type: REMOVE_ACCOUNT,
    account,
});
