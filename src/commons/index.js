import ethLogo from "../../assets/images/eth.png";
import btcLogo from "../../assets/images/btc.png";
import qtumLogo from "../../assets/images/qtum.png";
import lrcLogo from "../../assets/images/lrc.png";
import bnbLogo from "../../assets/images/bnb.png";
import neoLogo from "../../assets/images/neo.png";
import ethereumRegex from "ethereum-regex";

const configuredEthereumRegex = ethereumRegex({ exact: true });

export const PORTFOLIO_SOURCE = Object.freeze({
    ETH_WALLET: "ETH wallet",
    BTC_WALLET: "Bitcoin wallet",
    QTUM_WALLET: "QTUM wallet",
    NEO_WALLET: "NEO wallet",
    LOOPRING: "Loopring",
    BINANCE: "Binance",
});

export const PORTFOLIO_SOURCE_ICON = Object.freeze({
    [PORTFOLIO_SOURCE.ETH_WALLET]: ethLogo,
    [PORTFOLIO_SOURCE.BTC_WALLET]: btcLogo,
    [PORTFOLIO_SOURCE.QTUM_WALLET]: qtumLogo,
    [PORTFOLIO_SOURCE.NEO_WALLET]: neoLogo,
    [PORTFOLIO_SOURCE.LOOPRING]: lrcLogo,
    [PORTFOLIO_SOURCE.BINANCE]: bnbLogo,
});

export const SPECIFICATION_FIELD_TYPE = Object.freeze({ INPUT: "input" });

export const PORTFOLIO_SOURCE_SPECIFICATION = Object.freeze({
    [PORTFOLIO_SOURCE.ETH_WALLET]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "ETH address",
                required: true,
                validate: async (value, accounts, updating) => {
                    if (!configuredEthereumRegex.test(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.ETH_WALLET &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.BTC_WALLET]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "Bitcoin address",
                required: true,
                validate: (value, accounts, updating) => {
                    // TODO: add validation
                    // if (!configuredEthereumRegex.test(value)) {
                    //     return false;
                    // }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type === PORTFOLIO_SOURCE.BTC_WALLET &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.QTUM_WALLET]: {
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
                                account.type === PORTFOLIO_SOURCE.QTUM_WALLET &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.NEO_WALLET]: {
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
                                account.type === PORTFOLIO_SOURCE.QTUM_WALLET &&
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
});
