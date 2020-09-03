import { ToastAndroid } from "react-native";
import { Decimal } from "decimal.js";
import fetch from "node-fetch";
import { getPortfolioByAccountType } from "./handlers";

export const GET_PORTFOLIO_START = "GET_PORTFOLIO_START";
export const GET_PORTFOLIO_END = "GET_PORTFOLIO_END";
export const GET_PORTFOLIO_SUCCESS = "GET_PORTFOLIO_SUCCESS";

export const getPortfolio = (
    accounts,
    manualTransactions,
    fiatCurrency,
    coinGeckoIds
) => async (dispatch) => {
    dispatch({ type: GET_PORTFOLIO_START });
    try {
        const portfolio = [];
        for (const account of accounts) {
            const portfolioPiece = await getPortfolioByAccountType(
                account,
                coinGeckoIds
            );

            const nonEmptyPortfolioPiece = portfolioPiece.filter(
                (piece) => piece && piece.balance !== "0"
            );
            portfolio.push(...nonEmptyPortfolioPiece);
        }
        for (const manualTransaction of manualTransactions) {
            const decimalBalance = new Decimal(manualTransaction.balance);
            portfolio.push({
                ...manualTransaction,
                balance:
                    !manualTransaction.buy && decimalBalance.isPositive()
                        ? decimalBalance.negated().toFixed()
                        : manualTransaction.balance,
                coinGeckoId:
                    coinGeckoIds[manualTransaction.symbol.toLowerCase()],
            });
        }
        if (portfolio.length === 0) {
            dispatch({
                type: GET_PORTFOLIO_SUCCESS,
                portfolio: [],
            });
            return;
        }
        const uniqueCoinGeckoIds = portfolio.reduce((accumulator, asset) => {
            const { coinGeckoId } = asset;
            if (coinGeckoId && accumulator.indexOf(coinGeckoId) < 0) {
                accumulator.push(coinGeckoId);
            }
            return accumulator;
        }, []);
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${fiatCurrency}&sparkline=false&price_change_percentage=24h,7d,14d,30d&ids=${uniqueCoinGeckoIds.join(
                ","
            )}`
        );
        const marketData = await response.json();
        const mappedMarketData = marketData.reduce((accumulator, data) => {
            accumulator[data.id] = data;
            return accumulator;
        }, {});
        dispatch({
            type: GET_PORTFOLIO_SUCCESS,
            portfolio: portfolio.map((asset) => {
                const relatedMarketData = mappedMarketData[asset.coinGeckoId];
                return {
                    ...asset,
                    info: {
                        icon: relatedMarketData.image,
                        currentPrice: relatedMarketData.current_price,
                        priceChangePercentages: {
                            "1d":
                                relatedMarketData.price_change_percentage_24h_in_currency,
                            "1w":
                                relatedMarketData.price_change_percentage_7d_in_currency,
                            "2w":
                                relatedMarketData.price_change_percentage_14d_in_currency,
                            "1m":
                                relatedMarketData.price_change_percentage_30d_in_currency,
                        },
                    },
                };
            }),
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

export const RESET_PORTFOLIO = "RESET_PORTFOLIO";

export const resetPortfolio = () => ({ type: RESET_PORTFOLIO });
