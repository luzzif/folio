import { ToastAndroid } from "react-native";
import { getPortfolioByAccountType } from "./handlers";
import { getInfoFromCoinGecko, isCoinDismissedBasedOnInfo } from "../../utils";
import Decimal from "decimal.js";

// TODO: replace ToastAndroid with something else

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
                fiatCurrency,
                coinGeckoIds
            );

            portfolio.push(...portfolioPiece);
        }
        for (const manualTransaction of manualTransactions) {
            const info = await getInfoFromCoinGecko(
                manualTransaction.coinGeckoId,
                fiatCurrency
            );
            if (isCoinDismissedBasedOnInfo(info)) {
                return;
            }
            const decimalBalance = new Decimal(manualTransaction.balance);
            portfolio.push({
                ...manualTransaction,
                balance:
                    !manualTransaction.buy && decimalBalance.isPositive()
                        ? decimalBalance.negated().toFixed()
                        : manualTransaction.balance,
                info,
            });
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

export const RESET_PORTFOLIO = "RESET_PORTFOLIO";

export const resetPortfolio = () => ({ type: RESET_PORTFOLIO });
