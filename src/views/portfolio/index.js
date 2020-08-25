import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getPrices } from "../../actions/prices";
import BigNumber from "bignumber.js";
import { Header } from "../../components/header";
import { StyleSheet, View } from "react-native";
import { EmptyPortfolio } from "../../components/portfolio/empty";
import { PORTFOLIO_SOURCE, CURRENCY_SYMBOLS } from "../../commons";
import { getEthereumPortfolio, resetPortfolio } from "../../actions/portfolio";
import { List } from "../../components/list";
import { CryptoIcon } from "../../components/crypto-icon";
import { ThemeContext } from "../../contexts/theme";

export const Portfolio = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 36,
        },
        bottomSpacedContainer: {
            marginBottom: 36,
        },
    });

    const dispatch = useDispatch();
    const {
        portfolio,
        loadingPortfolio,
        prices,
        accounts,
        fiatCurrency,
    } = useSelector((state) => ({
        portfolio: state.portfolio.data,
        loadingPortfolio: !!state.portfolio.loadings,
        prices: state.prices.data,
        accounts: state.accounts,
        fiatCurrency: state.settings.fiatCurrency,
    }));

    const [aggregatedPortfolio, setAggregatedPortfolio] = useState([]);
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        dispatch(resetPortfolio());
        if (accounts && accounts.length > 0) {
            accounts.forEach((account) => {
                switch (account.type) {
                    case PORTFOLIO_SOURCE.ETHEREUM_WALLET: {
                        dispatch(getEthereumPortfolio(account.address));
                        break;
                    }
                }
            });
        }
    }, [accounts, dispatch]);

    useEffect(() => {
        setSymbols(
            portfolio.reduce((uniqueSymbols, asset) => {
                if (uniqueSymbols.indexOf(asset.symbol) < 0) {
                    uniqueSymbols.push(asset.symbol);
                }
                return uniqueSymbols;
            }, [])
        );
    }, [portfolio]);

    // after having extracted the unique symbols from the
    // portfolio, we can ask the current price for each one
    useEffect(() => {
        if (symbols && symbols.length > 0) {
            dispatch(getPrices(symbols, fiatCurrency));
        }
    }, [dispatch, fiatCurrency, symbols]);

    useEffect(() => {
        if (!loadingPortfolio && portfolio && portfolio.length > 0 && prices) {
            setAggregatedPortfolio(
                symbols
                    // sum the balance of every entry with the same symbol to
                    // get the aggregated balance
                    .reduce((finalPortfolio, symbol) => {
                        const assetsBySymbol = portfolio.filter(
                            (asset) =>
                                asset.symbol.toLowerCase() ===
                                symbol.toLowerCase()
                        );
                        const rawPrice = prices[symbol];
                        if (!rawPrice) {
                            return finalPortfolio;
                        }
                        const price = new BigNumber(rawPrice);
                        const totalBalance = assetsBySymbol.reduce(
                            (totalBalanceForSymbol, asset) =>
                                totalBalanceForSymbol.plus(asset.balance),
                            new BigNumber("0")
                        );
                        const value = totalBalance.multipliedBy(price);
                        if (!value.isLessThan("0.01")) {
                            finalPortfolio.push({
                                symbol,
                                balance: totalBalance,
                                price: price,
                                value,
                                icon: assetsBySymbol[0].icon,
                            });
                        }
                        return finalPortfolio;
                    }, [])
            );
        }
    }, [portfolio, symbols, prices, loadingPortfolio]);

    const handleRefresh = useCallback(() => {
        dispatch(resetPortfolio());
        if (accounts && accounts.length > 0) {
            accounts.forEach((account) => {
                switch (account.type) {
                    case PORTFOLIO_SOURCE.ETHEREUM_WALLET: {
                        dispatch(getEthereumPortfolio(account.address));
                        break;
                    }
                }
            });
        }
    }, [accounts, dispatch]);

    return (
        <View style={styles.root}>
            {aggregatedPortfolio && aggregatedPortfolio.length > 0 ? (
                <>
                    <View style={styles.bottomSpacedContainer}>
                        <Header
                            portfolio={aggregatedPortfolio}
                            fiatCurrency={fiatCurrency}
                        />
                    </View>
                    <List
                        header="Your assets"
                        items={aggregatedPortfolio.map((asset) => ({
                            key: asset.symbol,
                            icon: <CryptoIcon icon={asset.icon} size={36} />,
                            primary: asset.symbol,
                            tertiary: asset.balance.decimalPlaces(3).toString(),
                            quaternary: `${asset.value
                                .decimalPlaces(3)
                                .toString()} ${
                                CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                            }`,
                        }))}
                        onRefresh={handleRefresh}
                        refreshing={loadingPortfolio}
                    />
                </>
            ) : (
                <EmptyPortfolio loading={accounts && accounts.length > 0} />
            )}
        </View>
    );
};
