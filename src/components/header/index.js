import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import BigNumber from "bignumber.js";

export const Header = ({ portfolio }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            alignItems: "center",
            borderBottomColor: theme.border,
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
            fontSize: 44,
        },
    });

    const [totalBalance, setTotalBalance] = useState(new BigNumber("0"));

    useEffect(() => {
        if (portfolio && portfolio.length > 0) {
            setTotalBalance(
                portfolio.reduce(
                    (accumulator, asset) => accumulator.plus(asset.value),
                    new BigNumber("0")
                )
            );
        } else {
            setTotalBalance(new BigNumber("0"));
        }
    }, [portfolio]);

    return !totalBalance.isZero() ? (
        <View style={styles.root}>
            <Text style={styles.totalBalanceText}>Total balance:</Text>
            <Text style={styles.totalBalance}>
                ${totalBalance.decimalPlaces(3).toString()}
            </Text>
        </View>
    ) : null;
};

Header.propTypes = {
    portfolio: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.instanceOf(BigNumber).isRequired,
            symbol: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
};
