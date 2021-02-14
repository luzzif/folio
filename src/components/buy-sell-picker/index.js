import React, { useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

export const BuySellPicker = ({ buy, onChange }) => {
    const { colors: theme } = useTheme();

    const commonContainerStyle = {
        flexDirection: "row",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    };

    const styles = StyleSheet.create({
        root: {
            flexDirection: "row",
            width: "100%",
            height: 40,
            backgroundColor: theme.background,
            elevation: 8,
            borderRadius: 16,
        },
        buyCointainer: {
            ...commonContainerStyle,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
        },
        sellCointainer: {
            ...commonContainerStyle,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
        },
        label: {
            fontFamily: "Poppins-Bold",
            color: theme.white,
            fontSize: 16,
            letterSpacing: 1,
        },
    });

    const handleBuyPress = useCallback(() => {
        if (!buy) {
            onChange(true);
        }
    }, [buy, onChange]);

    const handleSellPress = useCallback(() => {
        if (buy) {
            onChange(false);
        }
    }, [buy, onChange]);

    return (
        <View style={styles.root}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={
                    buy
                        ? [theme.successDark, theme.successDarkMode]
                        : [theme.disabled, theme.disabled]
                }
                style={styles.buyCointainer}
                onTouchStart={handleBuyPress}
            >
                <Text style={styles.label}>Buy</Text>
            </LinearGradient>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={
                    buy
                        ? [theme.disabled, theme.disabled]
                        : [theme.errorDark, theme.errorDarkMode]
                }
                style={styles.sellCointainer}
                onTouchStart={handleSellPress}
            >
                <Text style={styles.label}>Sell</Text>
            </LinearGradient>
        </View>
    );
};
