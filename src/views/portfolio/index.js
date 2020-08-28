import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Decimal } from "decimal.js";
import { Header } from "../../components/header";
import { StyleSheet, View } from "react-native";
import { getPortfolio, resetPortfolio } from "../../actions/portfolio";
import { List } from "../../components/list";
import { CryptoIcon } from "../../components/crypto-icon";
import { ThemeContext } from "../../contexts/theme";
import { getCoinGeckoBaseData } from "../../actions/coingecko";
import { CURRENCY_SYMBOLS } from "../../commons";
import { formatDecimal } from "../../utils";
import { Fab } from "../../components/fab";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const Portfolio = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        headerContainer: {
            paddingHorizontal: 16,
            marginVertical: 20,
        },
        manualTransactionButtonContainer: {
            position: "absolute",
            bottom: 24,
            right: 24,
        },
    });

    const dispatch = useDispatch();
    const {
        portfolio,
        loadingPortfolio,
        accounts,
        fiatCurrency,
        coinGeckoIds,
        manualTransactions,
    } = useSelector((state) => ({
        portfolio: state.portfolio.data,
        loadingPortfolio: !!state.portfolio.loadings,
        accounts: state.accounts,
        fiatCurrency: state.settings.fiatCurrency,
        coinGeckoIds: state.coinGecko.ids,
        manualTransactions: state.manualTransactions,
    }));

    const [aggregatedPortfolio, setAggregatedPortfolio] = useState([]);
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        dispatch(getCoinGeckoBaseData(fiatCurrency));
    }, [dispatch, fiatCurrency]);

    useEffect(() => {
        if (!accounts || accounts.length === 0) {
            dispatch(resetPortfolio());
        }
    }, [accounts, dispatch]);

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
        if (portfolio && portfolio.length > 0) {
            setSymbols(
                portfolio.reduce((uniqueSymbols, asset) => {
                    if (uniqueSymbols.indexOf(asset.symbol) < 0) {
                        uniqueSymbols.push(asset.symbol);
                    }
                    return uniqueSymbols;
                }, [])
            );
        }
    }, [portfolio]);

    useEffect(() => {
        if (!loadingPortfolio && portfolio && portfolio.length > 0) {
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
                        const totalBalance = assetsBySymbol.reduce(
                            (totalBalanceForSymbol, asset) =>
                                totalBalanceForSymbol.plus(asset.balance),
                            new Decimal("0")
                        );
                        const { currentPrice, icon } = assetsBySymbol[0].info;
                        const value = totalBalance.times(currentPrice);
                        finalPortfolio.push({
                            symbol,
                            balance: totalBalance,
                            price: currentPrice,
                            value,
                            icon: icon,
                        });
                        return finalPortfolio;
                    }, [])
                    .sort((a, b) => b.value.minus(a.value).toNumber())
            );
        } else {
            setAggregatedPortfolio([]);
        }
    }, [portfolio, symbols, loadingPortfolio]);

    const handleRefresh = useCallback(() => {
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

    const handleAddManualTransactionPress = useCallback(() => {
        navigation.navigate("Manual transaction");
    }, [navigation]);

    const getAssetPressHandler = (symbol) => () => {
        navigation.navigate("Manual transactions", { symbol });
    };

    return (
        <View style={styles.root}>
            <View style={styles.headerContainer}>
                <Header
                    portfolio={aggregatedPortfolio}
                    fiatCurrency={fiatCurrency}
                    navigation={navigation}
                />
            </View>
            <List
                header="Your assets"
                items={aggregatedPortfolio.map((asset) => ({
                    key: asset.symbol,
                    icon: <CryptoIcon icon={asset.icon} size={36} />,
                    primary: asset.symbol,
                    tertiary: formatDecimal(asset.balance, 3),
                    quaternary: `${
                        CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                    }${formatDecimal(asset.value, 2)}`,
                    onPress: getAssetPressHandler(asset.symbol),
                }))}
                onRefresh={handleRefresh}
                refreshing={loadingPortfolio}
            />
            <View style={styles.manualTransactionButtonContainer}>
                <Fab
                    faIcon={faPlus}
                    onPress={handleAddManualTransactionPress}
                />
            </View>
        </View>
    );
};
