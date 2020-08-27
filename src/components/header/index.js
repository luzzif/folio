import React, { useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Decimal } from "decimal.js";
import { CURRENCY_SYMBOLS } from "../../commons";
import { PieChart } from "react-native-svg-charts";
import randomColor from "randomcolor";
import { formatDecimal } from "../../utils";

export const Header = ({ portfolio, fiatCurrency, navigation }) => {
    const theme = useContext(ThemeContext);

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
            fontSize: 36,
        },
        pieChart: {
            width: 60,
            height: 60,
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

    useEffect(() => {
        if (portfolio && portfolio.length > 0) {
            const {
                totalBalance: newTotalBalance,
                pieData: newPieData,
            } = portfolio.reduce(
                (accumulator, asset) => {
                    const { value, symbol } = asset;
                    accumulator.totalBalance = accumulator.totalBalance.plus(
                        value
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
                { totalBalance: new Decimal("0"), pieData: [] }
            );
            setTotalBalance(newTotalBalance);
            setPieData(newPieData);
        } else {
            setTotalBalance(new Decimal("0"));
            setPieData([emptyPieDataItem]);
        }
    }, [portfolio, theme, emptyPieDataItem]);

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
                        : totalBalance.gt(1000000000)
                        ? "Too rich sir"
                        : `${
                              CURRENCY_SYMBOLS[fiatCurrency.toUpperCase()]
                          }${formatDecimal(totalBalance, 2)}`}
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
};
