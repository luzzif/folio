import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import PropTypes from "prop-types";
import { ThemeContext } from "../../contexts/theme";
import { List } from "../list";
import { Decimal } from "decimal.js";
import randomColor from "randomcolor";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { formatDecimal } from "../../utils";

export const CoinSplit = ({ route }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 24,
        },
        pieChart: {
            width: 200,
            height: 200,
        },
        pieChartContainer: {
            width: "100%",
            alignItems: "center",
            marginBottom: 32,
        },
    });

    const [pieData] = useState(route.params.pieData);
    const [totalBalance] = useState(route.params.totalBalance);

    return (
        <View style={styles.root}>
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
                        primary: data.symbol,
                        icon: (
                            <FontAwesomeIcon
                                icon={faCircle}
                                size={28}
                                color={randomColor({ seed: data.symbol })}
                            />
                        ),
                        tertiary: `${formatDecimal(percentage, 2)}%`,
                    };
                })}
            />
        </View>
    );
};

CoinSplit.propTypes = {
    route: PropTypes.object.isRequired,
};
