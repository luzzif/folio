import Decimal from "decimal.js";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useAggregatedPortfolio = () => {
    const portfolio = useSelector((state) => state.portfolio.data);

    return useMemo(() => {
        console.log("really?");
        if (!portfolio || portfolio.length === 0) {
            return [];
        }
        const symbols = portfolio.reduce((uniqueSymbols, asset) => {
            if (uniqueSymbols.indexOf(asset.symbol) < 0) {
                uniqueSymbols.push(asset.symbol);
            }
            return uniqueSymbols;
        }, []);
        return (
            symbols
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
                .sort((a, b) => b.value.minus(a.value).toNumber())
        );
    }, []);
};
