import ethereumRegex from "ethereum-regex";

const configuredEthereumRegex = ethereumRegex({ exact: true });

export const PORTFOLIO_SOURCE = Object.freeze({
    ETHEREUM_WALLET: "Ethereum wallet",
    LOOPRING: "Loopring DEX",
    BINANCE: "Binance",
});

export const SPECIFICATION_FIELD_TYPE = Object.freeze({ INPUT: "input" });

export const PORTFOLIO_SOURCE_SPECIFICATION = Object.freeze({
    [PORTFOLIO_SOURCE.ETHEREUM_WALLET]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "Ethereum address",
                required: true,
                validate: (value, accounts, updating) => {
                    if (!configuredEthereumRegex.test(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) => account.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.LOOPRING]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "accountId",
                label: "Account id",
                required: true,
                validate: (value) => /^\d+$/.test(value),
            },
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "apiKey",
                label: "API key",
                required: true,
            },
        ],
    },
    [PORTFOLIO_SOURCE.BINANCE]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "apiKey",
                label: "API key",
                required: true,
            },
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "apiSecret",
                label: "API secret",
                required: true,
            },
        ],
    },
});

export const CURRENCY_SYMBOLS = Object.freeze({
    BTC: "₿",
    EUR: "€",
    USD: "$",
});
