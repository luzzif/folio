import { validateEthAddress } from "react-native-blockchain-address-validator/validators/eth";

export const WALLET_PORFOLIO_SOURCE = Object.freeze({
    ETH: "ETH",
    BTC: "BTC",
    QTUM: "QTUM",
    NEO: "NEO",
    XLM: "XLM",
});

export const EXCHANGE_PORFOLIO_SOURCE = Object.freeze({
    LOOPRING: "Loopring",
    BINANCE: "Binance",
});

export const PORTFOLIO_SOURCE = Object.freeze({
    ...WALLET_PORFOLIO_SOURCE,
    ...EXCHANGE_PORFOLIO_SOURCE,
});

export const SPECIFICATION_FIELD_TYPE = Object.freeze({ INPUT: "input" });

export const PORTFOLIO_SOURCE_SPECIFICATION = Object.freeze({
    [PORTFOLIO_SOURCE.ETH]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "ETH address",
                required: true,
                validate: async (value, accounts, updating) => {
                    if (!validateEthAddress(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.ETH &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.BTC]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "Bitcoin address",
                required: true,
                validate: async (value, accounts, updating) => {
                    const response = await fetch(
                        `https://api.blockcypher.com/v1/btc/main/addrs/${value}/balance`
                    );
                    if (!response.ok) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.BTC &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.QTUM]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "QTUM address",
                required: true,
                validate: async (value, accounts, updating) => {
                    if (!/^Q\w+$/.test(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.QTUM &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.NEO]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "NEO address",
                required: true,
                validate: async (value, accounts, updating) => {
                    const response = await fetch(
                        `https://api.neoscan.io/api/main_net/v1/get_balance/${value}`
                    );
                    if (!response.ok) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.QTUM &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.XLM]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "XLM address",
                required: true,
                validate: async (value, accounts, updating) => {
                    const response = await fetch(
                        `https://horizon.stellar.org/accounts/${value}`
                    );
                    if (!response.ok) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.XLM &&
                                account.fields.address === value
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
                validate: async (value, accounts, updating) => {
                    if (!/^\d+$/.test(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.LOOPRING &&
                                account.fields.accountId === value
                        );
                    }
                    return true;
                },
            },
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "apiKey",
                label: "API key",
                required: true,
                validate: (value, accounts, updating) => {
                    if (updating) {
                        return true;
                    }
                    return !accounts.find(
                        (account) =>
                            account.type === PORTFOLIO_SOURCE.LOOPRING &&
                            account.fields.apiKey === value
                    );
                },
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
                validate: async (value, accounts, updating) => {
                    if (updating) {
                        return true;
                    }
                    return !accounts.find(
                        (account) =>
                            account.type === PORTFOLIO_SOURCE.BINANCE &&
                            account.fields.apiKey === value
                    );
                },
            },
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "apiSecret",
                label: "API secret",
                required: true,
                validate: async (value, accounts, updating) => {
                    if (updating) {
                        return true;
                    }
                    return !accounts.find(
                        (account) =>
                            account.type === PORTFOLIO_SOURCE.BINANCE &&
                            account.fields.apiSecret === value
                    );
                },
            },
        ],
    },
});

export const CURRENCY_SYMBOLS = Object.freeze({
    BTC: "₿",
    EUR: "€",
    USD: "$",
    ETH: "Ξ",
});
