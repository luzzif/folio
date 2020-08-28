import ethereumRegex from "ethereum-regex";
import ethLogo from "../../assets/images/eth.png";
import qtumLogo from "../../assets/images/qtum.png";
import lrcLogo from "../../assets/images/lrc.png";
import bnbLogo from "../../assets/images/bnb.png";

const configuredEthereumRegex = ethereumRegex({ exact: true });

export const PORTFOLIO_SOURCE = Object.freeze({
    ETHEREUM_WALLET: "Ethereum wallet",
    QUANTUM_WALLET: "Quantum wallet (Qtum)",
    LOOPRING: "Loopring DEX",
    BINANCE: "Binance",
});

export const PORTFOLIO_SOURCE_ICON = Object.freeze({
    [PORTFOLIO_SOURCE.ETHEREUM_WALLET]: ethLogo,
    [PORTFOLIO_SOURCE.QUANTUM_WALLET]: qtumLogo,
    [PORTFOLIO_SOURCE.LOOPRING]: lrcLogo,
    [PORTFOLIO_SOURCE.BINANCE]: bnbLogo,
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
                            (account) =>
                                account.type ===
                                    PORTFOLIO_SOURCE.ETHEREUM_WALLET &&
                                account.fields.address === value
                        );
                    }
                    return true;
                },
            },
        ],
    },
    [PORTFOLIO_SOURCE.QUANTUM_WALLET]: {
        fields: [
            {
                type: SPECIFICATION_FIELD_TYPE.INPUT,
                name: "address",
                label: "Quantum address",
                required: true,
                validate: (value, accounts, updating) => {
                    if (!/^Q\w+$/.test(value)) {
                        return false;
                    }
                    if (!updating) {
                        return !accounts.find(
                            (account) =>
                                account.type ===
                                    PORTFOLIO_SOURCE.QUANTUM_WALLET &&
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
                validate: (value, accounts, updating) => {
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
                validate: (value, accounts, updating) => {
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
                validate: (value, accounts, updating) => {
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
