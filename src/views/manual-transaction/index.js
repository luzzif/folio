import React, { useContext, useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Select } from "../../components/select";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "../../components/switch";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { addManualTransaction } from "../../actions/manual-transaction";

export const ManualTransaction = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { assetOptions, fiatCurrency } = useSelector((state) => ({
        assetOptions: state.coinGecko.assetOptions,
        fiatCurrency: state.settings.fiatCurrency,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            padding: 16,
        },
        bottomSpacedContainer: {
            marginBottom: 24,
        },
        buyCointainer: {
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 4,
        },
        buyLabel: {
            flex: 1,
            paddingRight: 16,
            fontFamily: "Montserrat-Medium",
        },
    });

    const [asset, setAsset] = useState(
        assetOptions && assetOptions.length > 0 ? assetOptions[0] : null
    );
    const [buy, setBuy] = useState(true);
    const [amount, setAmount] = useState(0);
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
        dispatch(
            addManualTransaction(
                asset.label,
                buy,
                amount,
                asset.value,
                fiatCurrency
            )
        );
        navigation.pop();
    }, [amount, asset, buy, dispatch, fiatCurrency, navigation]);

    return (
        <View style={styles.root}>
            <View style={styles.bottomSpacedContainer}>
                <Select
                    label="Asset"
                    value={asset}
                    onChange={setAsset}
                    options={assetOptions}
                />
            </View>
            <View style={styles.bottomSpacedContainer}>
                <Input
                    label="Amount"
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={styles.bottomSpacedContainer}>
                <View style={styles.buyCointainer}>
                    <Text style={styles.buyLabel}>Buy</Text>
                    <Switch value={buy} onChange={handleBuyChange} />
                </View>
            </View>
            <Button
                title="Save"
                onPress={handleSavePress}
                disabled={!amount || amountError}
            />
        </View>
    );
};
