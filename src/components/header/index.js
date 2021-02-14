import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Decimal } from "decimal.js";
import { CURRENCY_SYMBOLS } from "../../commons";
import PieChartWhite from "../../../assets/svg/pie-white.svg";
import randomColor from "randomcolor";
import LinearGradient from "react-native-linear-gradient";
import { formatDecimal } from "../../utils";
import { Modal } from "../modal";
import { List } from "../list";
import { useDispatch } from "react-redux";
import { changePercentageChangeTimeframe } from "../../actions/settings";
import { CryptoIcon } from "../crypto-icon";

const commonPercentageChangeTextStyle = {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.75,
};

const commonAbsoluteChangeTextStyle = {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.75,
    marginRight: 6,
    paddingTop: 2,
};

const commonPercentageChangeTextContainerStyle = {
    height: 18,
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingTop: 2,
    alignSelf: "baseline",
};

export const Header = ({
    portfolio,
    fiatCurrency,
    percentageChangeTimeframe,
    navigation,
}) => {
    const { colors: theme } = useTheme();
    const dispatch = useDispatch();
    const [openTimeframeModal, setOpenTimeframeModal] = useState(false);

    const styles = StyleSheet.create({
        root: {
            elevation: 8,
            backgroundColor: theme.foreground,
            borderRadius: 16,
        },
        gradient: {
            flexDirection: "row",
            justifyContent: "space-between",
            elevation: 8,
            borderRadius: 16,
            backgroundColor: theme.foreground,
            paddingTop: 16,
            paddingBottom: 10,
            paddingHorizontal: 16,
        },
        leftBlock: {
            flex: 1,
            paddingRight: 16,
        },
        rightBlock: {
            justifyContent: "space-between",
            alignItems: "flex-end",
        },
        totalBalanceText: {
            fontFamily: "Poppins-Regular",
            color: theme.white,
            opacity: 1,
            fontSize: 13,
            lineHeight: 14,
            marginBottom: 6,
            letterSpacing: 0.25,
        },
        totalBalance: {
            fontFamily: "Poppins-Bold",
            color: theme.white,
            fontSize: 30,
            lineHeight: 34,
            letterSpacing: 1,
        },
        pieChart: {
            color: theme.white,
            borderRadius: 10,
            marginBottom: 3,
        },
        positivePercentageChangeText: {
            ...commonPercentageChangeTextStyle,
            color: theme.successDarkMode,
        },
        negativePercentageChangeText: {
            ...commonPercentageChangeTextStyle,
            color: theme.errorDarkMode,
        },
        positiveAbsoluteChangeText: {
            ...commonAbsoluteChangeTextStyle,
            color: theme.success,
        },
        negativeAbsoluteChangeText: {
            ...commonAbsoluteChangeTextStyle,
            color: theme.errorDarkMode,
        },
        changeRow: {
            flexDirection: "row",
        },
        positivePercentageChangeBackground: {
            ...commonPercentageChangeTextContainerStyle,
            backgroundColor: theme.successDark,
        },
        negativePercentageChangeBackground: {
            ...commonPercentageChangeTextContainerStyle,
            backgroundColor: theme.errorDark,
        },
        timeframeText: {
            fontFamily: "Poppins-Bold",
            alignItems: "flex-start",
            flexGrow: 0,
            color: theme.white,
            fontSize: 16,
            lineHeight: 18,
        },
    });

    const [emptyPieDataItem] = useState({
        key: "initial",
        value: 1,
        svg: {
            fill: theme.disabled,
        },
    });

    const [totalBalance, setTotalBalance] = useState(new Decimal("0"));
    const [pieData, setPieData] = useState([emptyPieDataItem]);
    const [percentageChange, setPortfolioPercentageChange] = useState(
        new Decimal("0")
    );
    const [absoluteChange, setAbsoluteChange] = useState(new Decimal("0"));

    useEffect(() => {
        if (portfolio && portfolio.length > 0) {
            const {
                totalBalance: newTotalBalance,
                pieData: newPieData,
            } = portfolio.reduce(
                (accumulator, asset) => {
                    const { value, symbol } = asset;
                    const decimalValue = new Decimal(value);
                    accumulator.totalBalance = accumulator.totalBalance.plus(
                        decimalValue
                    );
                    accumulator.pieData.push({
                        key: symbol,
                        value: value.toNumber(),
                        symbol,
                        label: symbol,
                        svg: {
                            fill: randomColor({ seed: symbol }),
                        },
                    });
                    return accumulator;
                },
                {
                    totalBalance: new Decimal("0"),
                    pieData: [],
                }
            );

            setTotalBalance(newTotalBalance);

            if (newTotalBalance.isZero()) {
                setPieData([emptyPieDataItem]);
            } else {
                setPieData(newPieData);
            }

            const portfolioPercentageChange = portfolio.reduce(
                (accumulator, asset) => {
                    const percentage =
                        asset.priceChangePercentages[percentageChangeTimeframe];

                    if (!percentage) {
                        return accumulator;
                    }

                    const decimalPercentageChange = new Decimal(percentage);
                    const decimalValue = new Decimal(asset.value);

                    return accumulator.plus(
                        new Decimal(decimalPercentageChange).times(
                            decimalValue.dividedBy(newTotalBalance)
                        )
                    );
                },
                new Decimal("0")
            );

            setPortfolioPercentageChange(portfolioPercentageChange);
            setAbsoluteChange(
                new Decimal(newTotalBalance)
                    .minus(
                        newTotalBalance.div(
                            portfolioPercentageChange.dividedBy(100).plus(1)
                        )
                    )
                    .absoluteValue()
            );
        } else {
            const decimalZero = new Decimal("0");
            setTotalBalance(decimalZero);
            setPieData([emptyPieDataItem]);
            setPortfolioPercentageChange(decimalZero);
        }
    }, [portfolio, theme, emptyPieDataItem, percentageChangeTimeframe]);

    const handlePieChartPress = useCallback(() => {
        navigation.navigate("Coin split", {
            pieData,
            totalBalance: totalBalance.toNumber(),
        });
    }, [navigation, pieData, totalBalance]);

    const handleTimeframeModalClose = useCallback(() => {
        setOpenTimeframeModal(false);
    }, []);

    const handleTimeframeModalOpen = useCallback(() => {
        setOpenTimeframeModal(true);
    }, []);

    return (
        <>
            <View style={styles.root}>
                <LinearGradient
                    start={
                        portfolio &&
                        percentageChange &&
                        (percentageChange.greaterThan(0) ||
                            percentageChange.isZero())
                            ? { x: 0.2, y: 0.2 }
                            : { x: 0, y: 0 }
                    }
                    end={{ x: 1, y: 1 }}
                    colors={[
                        "#8032E4",
                        portfolio &&
                        percentageChange &&
                        (percentageChange.greaterThan(0) ||
                            percentageChange.isZero())
                            ? theme.successDark
                            : theme.errorDark,
                    ]}
                    style={styles.gradient}
                >
                    <View style={styles.leftBlock}>
                        <Text style={styles.totalBalanceText}>
                            Total balance:
                        </Text>
                        <Text
                            style={styles.totalBalance}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {totalBalance.isZero()
                                ? "0"
                                : `${
                                      CURRENCY_SYMBOLS[
                                          fiatCurrency.toUpperCase()
                                      ]
                                  }${formatDecimal(totalBalance)}`}
                        </Text>
                        <View style={styles.changeRow}>
                            <Text
                                style={
                                    percentageChange.isPositive()
                                        ? styles.positiveAbsoluteChangeText
                                        : styles.negativeAbsoluteChangeText
                                }
                            >
                                {totalBalance.isZero()
                                    ? "0"
                                    : `${
                                          percentageChange.isPositive()
                                              ? "+"
                                              : "-"
                                      }${
                                          CURRENCY_SYMBOLS[
                                              fiatCurrency.toUpperCase()
                                          ]
                                      }${formatDecimal(absoluteChange)}`}
                            </Text>
                            <View
                                style={
                                    percentageChange.isPositive()
                                        ? styles.positivePercentageChangeBackground
                                        : styles.negativePercentageChangeBackground
                                }
                            >
                                <Text
                                    style={
                                        percentageChange.isPositive()
                                            ? styles.positivePercentageChangeText
                                            : styles.negativePercentageChangeText
                                    }
                                >
                                    {totalBalance.isZero()
                                        ? "0%"
                                        : `${
                                              percentageChange.isPositive()
                                                  ? "+"
                                                  : ""
                                          }${formatDecimal(percentageChange)}%`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rightBlock}>
                        <TouchableOpacity onPress={handleTimeframeModalOpen}>
                            <Text style={styles.timeframeText}>
                                {percentageChangeTimeframe}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.pieChart}
                            disabled={
                                pieData.length > 0 &&
                                pieData[0] === emptyPieDataItem
                            }
                            onPress={handlePieChartPress}
                        >
                            <PieChartWhite width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
            <Modal
                title="Timeframe"
                open={openTimeframeModal}
                onClose={handleTimeframeModalClose}
            >
                <List
                    items={[
                        {
                            key: "24h",
                            primary: "24 hours",
                            onPress: () => {
                                setOpenTimeframeModal(false);
                                dispatch(changePercentageChangeTimeframe("1d"));
                            },
                            icon: <CryptoIcon icon="24h" size={36} />,
                        },
                        {
                            key: "7d",
                            primary: "7 days",
                            onPress: () => {
                                setOpenTimeframeModal(false);
                                dispatch(changePercentageChangeTimeframe("1w"));
                            },
                            icon: <CryptoIcon icon="7d" size={36} />,
                        },
                        {
                            key: "14d",
                            primary: "2 weeks",
                            onPress: () => {
                                setOpenTimeframeModal(false);
                                dispatch(changePercentageChangeTimeframe("2w"));
                            },
                            icon: <CryptoIcon icon="14d" size={36} />,
                        },
                        {
                            key: "30d",
                            primary: "30 days",
                            onPress: () => {
                                setOpenTimeframeModal(false);
                                dispatch(changePercentageChangeTimeframe("1m"));
                            },
                            icon: <CryptoIcon icon="30d" size={36} />,
                        },
                    ]}
                />
            </Modal>
        </>
    );
};

Header.propTypes = {
    portfolio: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.instanceOf(Decimal).isRequired,
            symbol: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    fiatCurrency: PropTypes.string.isRequired,
    percentageChangeTimeframe: PropTypes.string.isRequired,
};
