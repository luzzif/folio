import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import PropTypes from "prop-types";
import { useTheme } from "@react-navigation/native";
import { List } from "../list";
import { Decimal } from "decimal.js";
import randomColor from "randomcolor";
import { formatDecimal } from "../../utils";
import { AppTitle } from "../app-title";

export const CoinSplit = ({ navigation, route }) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        pieChart: {
            width: 200,
            height: 200,
        },
        pieChartContainer: {
            width: "100%",
            alignItems: "center",
            marginBottom: 32,
            marginTop: 16,
        },
        legendCircle: {
            width: 28,
            height: 28,
            borderRadius: 14,
        },
    });

    const [pieData] = useState(route.params.pieData);
    const [totalBalance] = useState(route.params.totalBalance);

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    return (
        <View style={styles.root}>
            <AppTitle title="Coin split" closeable onClose={handleClose} />
            <View style={styles.pieChartContainer}>
                <PieChart style={styles.pieChart} data={pieData} />
            </View>
            <List
                header="Coin split"
                items={pieData.map((data) => {
                    const percentage = new Decimal(data.value)
                        .dividedBy(totalBalance)
                        .times(100);
                    return {
                        key: data.symbol,
                        primary: data.symbol,
                        icon: (
                            <View
                                style={{
                                    ...styles.legendCircle,
                                    backgroundColor: randomColor({
                                        seed: data.symbol,
                                    }),
                                }}
                            />
                        ),
                        tertiary: `${formatDecimal(percentage)}%`,
                    };
                })}
            />
        </View>
    );
};

CoinSplit.propTypes = {
    route: PropTypes.object.isRequired,
};
