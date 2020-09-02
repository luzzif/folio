import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Decimal } from "decimal.js";
import { Header } from "../../components/header";
import { StyleSheet, View, Text } from "react-native";
import { getPortfolio, resetPortfolio } from "../../actions/portfolio";
import { List } from "../../components/list";
import { CryptoIcon } from "../../components/crypto-icon";
import { ThemeContext } from "../../contexts/theme";
import { getCoinGeckoBaseData } from "../../actions/coingecko";
import { CURRENCY_SYMBOLS } from "../../commons";
import { formatDecimal } from "../../utils";
import { Fab } from "../../components/fab";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Chip } from "../../components/chip";
import { changePercentageChangeTimeframe } from "../../actions/settings";

export const Portfolio = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    const commonPercentageChangeTextStyle = {
        fontFamily: "Nunito-Bold",
        fontSize: 12,
    };

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        headerContainer: {
            paddingHorizontal: 16,
            marginVertical: 12,
        },
        manualTransactionButtonContainer: {
            position: "absolute",
            bottom: 24,
            right: 24,
        },
        timeframeChooserContainer: {
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 8,
        },
        rightSpacedContainer: {
            marginRight: 12,
        },
        positiveText: {
            ...commonPercentageChangeTextStyle,
            color: theme.success,
        },
        negativeText: {
            ...commonPercentageChangeTextStyle,
            color: theme.error,
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
        percentageChangeTimeframe,
    } = useSelector((state) => ({
        portfolio: state.portfolio.data,
        loadingPortfolio: !!state.portfolio.loadings,
        accounts: state.accounts,
        fiatCurrency: state.settings.fiatCurrency,
        coinGeckoIds: state.coinGecko.ids,
        manualTransactions: state.manualTransactions,
        percentageChangeTimeframe: state.settings.percentageChangeTimeframe,
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
        if (!manualTransactions || manualTransactions.length === 0) {
            setAggregatedPortfolio([]);
        }
    }, [dispatch, manualTransactions]);

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
                        const {
                            currentPrice,
                            icon,
                            priceChangePercentages,
                        } = assetsBySymbol[0].info;
                        const value = totalBalance.times(currentPrice);
                        finalPortfolio.push({
                            symbol,
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

    const getPercentageChangeTimeframeHandler = (timeframe) => () => {
        dispatch(changePercentageChangeTimeframe(timeframe));
    };

    return (
        <View style={styles.root}>
            <View style={styles.headerContainer}>
                <Header
                    portfolio={aggregatedPortfolio}
                    fiatCurrency={fiatCurrency}
                    percentageChangeTimeframe={percentageChangeTimeframe}
                    navigation={navigation}
                />
            </View>
            <View style={styles.timeframeChooserContainer}>
                <View style={styles.rightSpacedContainer}>
                    <Chip
                        label="1d"
                        active={percentageChangeTimeframe === "1d"}
                        onPress={getPercentageChangeTimeframeHandler("1d")}
                    />
                </View>
                <View style={styles.rightSpacedContainer}>
                    <Chip
                        label="1w"
                        active={percentageChangeTimeframe === "1w"}
                        onPress={getPercentageChangeTimeframeHandler("1w")}
                    />
                </View>
                <View style={styles.rightSpacedContainer}>
                    <Chip
                        label="2w"
                        active={percentageChangeTimeframe === "2w"}
                        onPress={getPercentageChangeTimeframeHandler("2w")}
                    />
                </View>
                <Chip
                    label="1m"
                    active={percentageChangeTimeframe === "1m"}
                    onPress={getPercentageChangeTimeframeHandler("1m")}
                />
            </View>
            <List
                bottomSpacing={100}
                items={aggregatedPortfolio.map((asset) => {
                    const percentage =
                        asset.priceChangePercentages[percentageChangeTimeframe];
                    const decimalPercentageChange = new Decimal(
                        percentage || 0
                    );
                    return {
                        key: asset.symbol,
                        icon: <CryptoIcon icon={asset.icon} size={32} />,
                        primary: asset.symbol,
                        secondary: formatDecimal(asset.balance, 3),
                        tertiary: `${
                            CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                        }${formatDecimal(asset.value)}`,
                        quaternary: (
                            <Text
                                style={
                                    percentage &&
                                    decimalPercentageChange.isPositive()
                                        ? styles.positiveText
                                        : styles.negativeText
                                }
                            >
                                {percentage
                                    ? `${formatDecimal(
                                          decimalPercentageChange
                                      )}%`
                                    : "-"}
                            </Text>
                        ),
                        onPress: getAssetPressHandler(asset.symbol),
                    };
                })}
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
