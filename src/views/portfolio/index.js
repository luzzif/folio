import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Decimal } from "decimal.js";
import { Header } from "../../components/header";
import { StyleSheet, View, Text } from "react-native";
import { getPortfolio, resetPortfolio } from "../../actions/portfolio";
import { List } from "../../components/list";
import { CryptoIcon } from "../../components/crypto-icon";
import { useTheme } from "@react-navigation/native";
import { getCoinGeckoBaseData } from "../../actions/coingecko";
import { CURRENCY_SYMBOLS } from "../../commons";
import { formatDecimal } from "../../utils";
import CogWhiteIcon from "../../../assets/svg/cog-white.svg";
import CogBlackIcon from "../../../assets/svg/cog-black.svg";
import PlusIcon from "../../../assets/svg/plus.svg";
import { Fab } from "../../components/fab";
import { AppTitle } from "../../components/app-title";

export const Portfolio = ({ navigation }) => {
    const { dark, colors: theme } = useTheme();

    const commonPercentageChangeTextStyle = {
        fontFamily: "Poppins-Bold",
        fontSize: 12,
    };

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        headerContainer: {
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        manualTransactionButtonContainer: {
            position: "absolute",
            bottom: 16,
            right: 16,
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
        listItemPrimaryContainer: {
            flexDirection: "row",
        },
        listItemAssetSymbolText: {
            fontFamily: "Poppins-Bold",
            fontSize: 16,
            lineHeight: 18,
            letterSpacing: 0.25,
            color: theme.text,
        },
        listItemAssetNameText: {
            fontFamily: "Poppins-Regular",
            fontSize: 10,
            lineHeight: 20,
            letterSpacing: 0.25,
            color: theme.text,
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

    const handleAddPress = useCallback(() => {
        navigation.navigate("Add chooser");
    }, [navigation]);

    const handleCogPress = useCallback(() => {
        navigation.navigate("Settings");
    }, [navigation]);

    const getAssetPressHandler = (symbol) => () => {
        navigation.navigate("Manual transactions", { symbol });
    };

    return (
        <View style={styles.root}>
            <AppTitle
                title="Portfolio"
                actions={[
                    {
                        icon: dark ? CogWhiteIcon : CogBlackIcon,
                        onPress: handleCogPress,
                    },
                ]}
            />
            <View style={styles.headerContainer}>
                <Header
                    portfolio={aggregatedPortfolio}
                    fiatCurrency={fiatCurrency}
                    percentageChangeTimeframe={percentageChangeTimeframe}
                    navigation={navigation}
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
                        icon: <CryptoIcon icon={asset.symbol} size={36} />,
                        primary: (
                            <View style={styles.listItemPrimaryContainer}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={styles.listItemAssetSymbolText}
                                >
                                    {asset.symbol}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={styles.listItemAssetNameText}
                                >
                                    {"  "}
                                    {asset.name}
                                </Text>
                            </View>
                        ),
                        secondary: `${formatDecimal(asset.balance, 3)} | ${
                            CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                        }${formatDecimal(new Decimal(asset.price), 2)}`,
                        tertiary: `${
                            CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                        }${
                            asset.value.greaterThan(1000000000000)
                                ? "1,000+ billions"
                                : formatDecimal(asset.value)
                        }`,
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
                                    : "0%"}
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
                    icon={<PlusIcon width={20} height={20} />}
                    onPress={handleAddPress}
                />
            </View>
        </View>
    );
};
