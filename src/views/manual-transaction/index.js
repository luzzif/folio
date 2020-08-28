import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Select } from "../../components/select";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "../../components/switch";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { addManualTransaction } from "../../actions/manual-transaction";
import { CryptoIcon } from "../../components/crypto-icon";

export const ManualTransaction = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { markets, fiatCurrency } = useSelector((state) => ({
        markets: state.coinGecko.markets,
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
            color: theme.text,
        },
    });

    const [assetOptions, setAssetOptions] = useState([]);
    const [asset, setAsset] = useState(null);
    const [buy, setBuy] = useState(true);
    const [amount, setAmount] = useState(0);
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        const options = markets
            .map((market) => ({
                value: market.id,
                label: market.symbol.toUpperCase(),
                listItemSpecification: {
                    key: market.id,
                    icon: <CryptoIcon icon={market.image} size={36} />,
                    primary: market.symbol.toUpperCase(),
                },
            }))
            .sort((a, b) => {
                const firstLabel = a.label.toLowerCase();
                const secondLabel = b.label.toLowerCase();
                if (firstLabel.firstname < secondLabel.firstname) {
                    return -1;
                }
                if (firstLabel.firstname > secondLabel.firstname) {
                    return 1;
                }
                return 0;
            });
        setAssetOptions(options);
        setAsset(options[0]);
    }, [markets]);

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
