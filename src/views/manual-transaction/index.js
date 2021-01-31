import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import {
    addManualTransaction,
    updateManualTransaction,
} from "../../actions/manual-transaction";
import { AppTitle } from "../../components/app-title";
import { BuySellPiacker } from "../../components/buy-sell-picker";

export const ManualTransaction = ({ navigation, route }) => {
    const { colors: theme } = useTheme();
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
        },
        content: {
            paddingHorizontal: 16,
        },
        bottomSpacedContainer: {
            marginBottom: 20,
        },
        buttonContainer: {
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
        },
    });

    const [buy, setBuy] = useState(
        route.params.buy !== null && route.params.buy !== undefined
            ? route.params.buy
            : true
    );
    const [notes, setNotes] = useState(route.params.notes || "");
    const [amount, setAmount] = useState(route.params.balance || 0);
    const [amountError, setAmountError] = useState(false);

    const handleBuyChange = useCallback(() => {
        setBuy(!buy);
    }, [buy]);

    const handleAmountChange = useCallback((newAmount) => {
        if (/^\d+(\.\d*)?$/.test(newAmount)) {
            setAmount(newAmount);
            setAmountError(!parseFloat(newAmount));
        } else {
            setAmount("");
            setAmountError(true);
        }
    }, []);

    const handleSavePress = useCallback(() => {
        if (route.params && route.params.timestamp) {
            dispatch(
                updateManualTransaction(
                    route.params.timestamp,
                    route.params.symbol,
                    amount,
                    buy,
                    notes,
                    route.params.coinGeckoId
                )
            );
        } else {
            dispatch(
                addManualTransaction(
                    route.params.symbol,
                    buy,
                    amount,
                    notes,
                    route.params.coinGeckoId
                )
            );
        }
        navigation.pop();
    }, [amount, buy, dispatch, navigation, notes, route.params]);

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    return (
        <View style={styles.root}>
            <AppTitle
                title={`${
                    route.params.timestamp ? "Edit" : "Add"
                } tx (${route.params.symbol.toUpperCase()})`}
                closeable
                onClose={handleClose}
            />
            <View style={styles.content}>
                <View style={styles.bottomSpacedContainer}>
                    <BuySellPiacker buy={buy} onChange={handleBuyChange} />
                </View>
                <View style={styles.bottomSpacedContainer}>
                    <Input
                        placeholder="Amount"
                        value={amount}
                        onChangeText={handleAmountChange}
                        keyboardType="decimal-pad"
                    />
                </View>
                <View style={styles.bottomSpacedContainer}>
                    <Input
                        placeholder="Notes"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Save"
                    onPress={handleSavePress}
                    disabled={!amount || amountError}
                />
            </View>
        </View>
    );
};
