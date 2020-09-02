import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Select } from "../../components/select";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "../../components/switch";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import {
    addManualTransaction,
    updateManualTransaction,
} from "../../actions/manual-transaction";

export const ManualTransaction = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { wrappedIds } = useSelector((state) => ({
        wrappedIds: state.coinGecko.wrappedIds,
        fiatCurrency: state.settings.fiatCurrency,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 16,
            paddingHorizontal: 12,
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
            fontFamily: "Nunito-Regular",
            color: theme.text,
        },
    });

    const [assetOptions, setAssetOptions] = useState([]);
    const [asset, setAsset] = useState(null);
    const [buy, setBuy] = useState(
        route.params &&
            route.params.buy !== null &&
            route.params.buy !== undefined
            ? route.params.buy
            : true
    );
    const [amount, setAmount] = useState(
        route.params && route.params.balance ? route.params.balance : 0
    );
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        const options = wrappedIds.map((wrappedId) => {
            const { id, symbol } = wrappedId;
            const upperCaseSymbol = symbol.toUpperCase();
            return {
                value: id,
                label: upperCaseSymbol,
                listItemSpecification: {
                    key: id,
                    primary: upperCaseSymbol,
                },
            };
        });
        setAssetOptions(options);
        if (route.params) {
            setAsset(
                options.find(
                    (option) =>
                        option.label.toLowerCase() ===
                        route.params.symbol.toLowerCase()
                )
            );
        } else {
            setAsset(options[0]);
        }
    }, [wrappedIds, route]);

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
        if (route.params) {
            dispatch(
                updateManualTransaction(
                    route.params.timestamp,
                    route.params.symbol,
                    amount,
                    buy,
                    route.params.coinGeckoId
                )
            );
        } else {
            dispatch(
                addManualTransaction(asset.label, buy, amount, asset.value)
            );
        }
        navigation.pop();
    }, [amount, asset, buy, dispatch, navigation, route]);

    return (
        <View style={styles.root}>
            <View style={styles.bottomSpacedContainer}>
                <Select
                    label="Asset"
                    value={asset}
                    onChange={setAsset}
                    options={assetOptions}
                    searchable
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
