import hash from "hash.js";
import { Decimal } from "decimal.js";
import { PORTFOLIO_SOURCE } from "../../commons";
import { decimalFromWei, getIconLink, getInfoFromCoinGecko } from "../../utils";
import { ToastAndroid } from "react-native";

// TODO: replace ToastAndroid with something else

export const GET_PORTFOLIO_START = "GET_PORTFOLIO_START";
export const GET_PORTFOLIO_END = "GET_PORTFOLIO_END";
export const GET_PORTFOLIO_SUCCESS = "GET_PORTFOLIO_SUCCESS";

export const getPortfolio = (accounts, fiatCurrency, coinGeckoIds) => async (
    dispatch
) => {
    dispatch({ type: GET_PORTFOLIO_START });
    try {
        const portfolio = [];
        for (const account of accounts) {
            const { type } = account;
            let portfolioPiece = [];
            switch (type) {
                case PORTFOLIO_SOURCE.ETHEREUM_WALLET: {
                    portfolioPiece = await getEthereumPortfolio(
                        account.address,
                        fiatCurrency,
                        coinGeckoIds
                    );
                    break;
                }
                default: {
                    console.warn(`unsupported account type ${type}`);
                }
            }
            portfolio.push(...portfolioPiece);
        }
        dispatch({
            type: GET_PORTFOLIO_SUCCESS,
            portfolio,
        });
    } catch (error) {
        console.error("error while getting the portfolio", error);
        ToastAndroid.show(
            "There was an error fetching the updated portfolio.",
            5000
        );
    } finally {
        dispatch({ type: GET_PORTFOLIO_END });
    }
};

export const getEthereumPortfolio = async (
    address,
    fiatCurrency,
    coinGeckoIds
) => {
    const response = await fetch(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const portfolio = [];
    const { tokens } = json;
    if (tokens && tokens.length > 0) {
        for (const token of json.tokens) {
            const { symbol, decimals } = token.tokenInfo;
            const coinGeckoId = coinGeckoIds[symbol.toLowerCase()];
            if (!coinGeckoId) {
                console.warn(`could not get coingecko id for symbol ${symbol}`);
                continue;
            }
            const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
            if (new Decimal(info.circulatingSupply).isZero()) {
                // the token was dismissed
                continue;
            }
            portfolio.push({
                symbol,
                balance: decimalFromWei(new Decimal(token.balance), decimals),
                source: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
                info,
            });
        }
    }
    portfolio.push({
        symbol: "ETH",
        balance: json.ETH.balance,
        source: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
        info: await getInfoFromCoinGecko(coinGeckoIds.eth, fiatCurrency),
    });
    return portfolio;
};

export const getBinancePortfolio = (apiKey, apiSecret) => async (dispatch) => {
    dispatch({ type: GET_PORTFOLIO_START });
    try {
        const params = `timestamp=${Date.now()}`;
        const signature = hash
            .hmac(hash.sha256, apiSecret)
            .update(params)
            .digest("hex");
        const response = await fetch(
            `https://api.binance.com/api/v3/account?${params}&signature=${signature}`,
            {
                headers: {
                    "X-MBX-APIKEY": apiKey,
                },
            }
        );
        if (!response.ok) {
            throw new Error("invalid response");
        }
        const json = await response.json();
        const balances = json.balances.filter(
            (balance) =>
                !new Decimal(balance.free).isZero() ||
                !new Decimal(balance.locked).isZero()
        );
        const portfolio = [];
        for (const balance of balances) {
            const { asset, free, locked } = balance;
            portfolio.push({
                symbol: asset,
                balance: new Decimal(free).plus(locked).toFixed(),
                source: PORTFOLIO_SOURCE.BINANCE,
                icon: await getIconLink(asset),
            });
        }
        dispatch({
            type: GET_PORTFOLIO_SUCCESS,
            portfolio,
        });
    } catch (error) {
        console.error("error getting binance portfolio", error);
        ToastAndroid.show(
            "There was an error fetching the updated portfolio.",
            5000
        );
    } finally {
        dispatch({ type: GET_PORTFOLIO_END });
    }
};

export const RESET_PORTFOLIO = "RESET_PORTFOLIO";

export const resetPortfolio = () => ({ type: RESET_PORTFOLIO });
