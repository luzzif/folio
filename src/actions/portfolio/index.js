import hash from "hash.js";
import BigNumber from "bignumber.js";
import { PORTFOLIO_SOURCE } from "../../commons";
import { bigNumberFromWei, getIconLink } from "../../utils";
import { ToastAndroid } from "react-native";

// TODO: replace ToastAndroid with something else

export const GET_PORTFOLIO_START = "GET_PORTFOLIO_START";
export const GET_PORTFOLIO_END = "GET_PORTFOLIO_END";
export const GET_PORTFOLIO_SUCCESS = "GET_PORTFOLIO_SUCCESS";

export const getEthereumPortfolio = (address) => async (dispatch) => {
    dispatch({ type: GET_PORTFOLIO_START });
    try {
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
                portfolio.push({
                    symbol,
                    balance: bigNumberFromWei(
                        new BigNumber(token.balance),
                        decimals
                    ),
                    source: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
                    icon: await getIconLink(symbol),
                });
            }
        }
        portfolio.push({
            symbol: "ETH",
            balance: json.ETH.balance,
            source: PORTFOLIO_SOURCE.ETHEREUM_WALLET,
            icon: await getIconLink("ETH"),
        });
        dispatch({
            type: GET_PORTFOLIO_SUCCESS,
            portfolio,
        });
    } catch (error) {
        console.error("error getting ethereum portfolio", error);
        ToastAndroid.show(
            "There was an error fetching the updated portfolio.",
            5000
        );
    } finally {
        dispatch({ type: GET_PORTFOLIO_END });
    }
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
                !new BigNumber(balance.free).isZero() ||
                !new BigNumber(balance.locked).isZero()
        );
        const portfolio = [];
        for (const balance of balances) {
            const { asset, free, locked } = balance;
            portfolio.push({
                symbol: asset,
                balance: new BigNumber(free).plus(locked).toFixed(),
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
