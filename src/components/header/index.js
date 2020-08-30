import React, { useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Decimal } from "decimal.js";
import { CURRENCY_SYMBOLS } from "../../commons";
import { PieChart } from "react-native-svg-charts";
import randomColor from "randomcolor";
import { formatDecimal } from "../../utils";

export const Header = ({
    portfolio,
    fiatCurrency,
    percentageChangeTimeframe,
    navigation,
}) => {
    const theme = useContext(ThemeContext);

    const commonPercentageChangeTextStyle = {
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
    };

    const styles = StyleSheet.create({
        root: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomColor: theme.border,
            elevation: 12,
            borderRadius: 12,
            backgroundColor: theme.foreground,
            paddingVertical: 16,
            paddingHorizontal: 20,
        },
        totalBalanceText: {
            fontFamily: "Montserrat-Medium",
            color: theme.text,
            opacity: 0.6,
            fontSize: 12,
        },
        totalBalance: {
            fontFamily: "Montserrat-Bold",
            color: theme.text,
            fontSize: 32,
        },
        pieChart: {
            width: 60,
            height: 60,
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
            setPortfolioPercentageChange(
                portfolio.reduce((accumulator, asset) => {
                    const decimalPercentageChange = new Decimal(
                        asset.priceChangePercentages[percentageChangeTimeframe]
                    );
                    const decimalValue = new Decimal(asset.value);
                    return accumulator.plus(
                        new Decimal(decimalPercentageChange).times(
                            decimalValue.dividedBy(newTotalBalance)
                        )
                    );
                }, new Decimal("0"))
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

    return (
        <View style={styles.root}>
            <View>
                <Text style={styles.totalBalanceText}>Total balance:</Text>
                <Text
                    style={styles.totalBalance}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {totalBalance.isZero()
                        ? "-"
                        : `${
                              CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                          }${formatDecimal(totalBalance, 2)}`}
                </Text>
                <Text
                    style={
                        percentageChange.isPositive()
                            ? styles.positiveText
                            : styles.negativeText
                    }
                >
                    {totalBalance.isZero()
                        ? "-"
                        : `${
                              percentageChange.isPositive() ? "+" : ""
                          }${formatDecimal(percentageChange)}%`}
                </Text>
            </View>
            <TouchableOpacity
                disabled={pieData.length > 0 && pieData[0] === emptyPieDataItem}
                onPress={handlePieChartPress}
            >
                <PieChart style={styles.pieChart} data={pieData} />
            </TouchableOpacity>
        </View>
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
