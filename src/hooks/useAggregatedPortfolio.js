import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../actions/portfolio";

export const useAggregatedPortfolio = () => {
    const dispatch = useDispatch();
    const {
        portfolio,
        accounts,
        fiatCurrency,
        coinGeckoIds,
        manualTransactions,
    } = useSelector((state) => ({
        portfolio: state.portfolio.data,
        accounts: state.accounts,
        fiatCurrency: state.settings.fiatCurrency,
        coinGeckoIds: state.coinGecko.ids,
        manualTransactions: state.manualTransactions,
    }));
    const [aggregatedPortfolio, setAggregatedPortfolio] = useState([]);

    useEffect(() => {
        if (coinGeckoIds) {
            dispatch(
                getPortfolio(
                    accounts,
                    manualTransactions,
                    fiatCurrency,
                    coinGeckoIds
                )
            );
        }
    }, [accounts, coinGeckoIds, dispatch, fiatCurrency, manualTransactions]);

    useEffect(() => {
        if (!portfolio || portfolio.length === 0) {
            return;
        }
        const symbols = portfolio.reduce((uniqueSymbols, asset) => {
            if (uniqueSymbols.indexOf(asset.symbol) < 0) {
                uniqueSymbols.push(asset.symbol);
            }
            return uniqueSymbols;
        }, []);
        const aggregated = symbols
            // sum the balance of every entry with the same symbol to
            // get the aggregated balance
            .reduce((finalPortfolio, symbol) => {
                const assetsBySymbol = portfolio.filter(
                    (asset) =>
                        asset.symbol.toLowerCase() === symbol.toLowerCase()
                );
                const totalBalance = assetsBySymbol.reduce(
                    (totalBalanceForSymbol, asset) =>
                        totalBalanceForSymbol.plus(asset.balance),
                    new Decimal("0")
                );
                const {
                    currentPrice,
                    icon,
                    priceChangePercentages,
                } = assetsBySymbol[0].info;
                const value = totalBalance.times(currentPrice);
                finalPortfolio.push({
                    symbol,
                    name: assetsBySymbol[0].name,
                    balance: totalBalance,
                    price: currentPrice,
                    value,
                    priceChangePercentages,
                    icon: icon,
                });
                return finalPortfolio;
            }, [])
            .sort((a, b) => b.value.minus(a.value).toNumber());
        setAggregatedPortfolio(aggregated);
    }, [portfolio]);

    return aggregatedPortfolio;
};
