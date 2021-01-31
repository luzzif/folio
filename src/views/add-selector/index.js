import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AppTitle } from "../../components/app-title";
import { AddOption } from "./option";
import { useSelector } from "react-redux";
import {
    EXCHANGE_PORFOLIO_SOURCE,
    WALLET_PORFOLIO_SOURCE,
} from "../../commons";
import { CryptoIcon } from "../../components/crypto-icon";
import { Select } from "../../components/select";

export const AddChooser = ({ navigation }) => {
    const { colors: theme } = useTheme();
    const { wrappedIds } = useSelector((state) => ({
        wrappedIds: state.coinGecko.wrappedIds,
    }));

    const [manualTxModalOpen, setManualTxModalOpen] = useState(false);
    const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [assetOptions, setAssetOptions] = useState([]);
    const [exchangeOptions, setExchangeOptions] = useState([]);
    const [walletOptions, setWalletOptions] = useState([]);

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        optionContainer: {
            paddingHorizontal: 16,
            marginBottom: 12,
        },
        searchInputContainer: {
            paddingHorizontal: 20,
            marginBottom: 12,
        },
    });

    useEffect(() => {
        setAssetOptions(
            wrappedIds.map((wrappedId) => {
                const { id, symbol } = wrappedId;
                const upperCaseSymbol = symbol.toUpperCase();
                return {
                    key: id,
                    label: upperCaseSymbol,
                    value: upperCaseSymbol,
                    listItemSpecification: {
                        icon: <CryptoIcon size={36} icon={symbol} />,
                        primary: upperCaseSymbol,
                    },
                };
            })
        );
        setExchangeOptions(
            Object.keys(EXCHANGE_PORFOLIO_SOURCE)
                .sort()
                .map((key) => ({
                    key: key,
                    label: EXCHANGE_PORFOLIO_SOURCE[key],
                    value: EXCHANGE_PORFOLIO_SOURCE[key],
                    listItemSpecification: {
                        icon: <CryptoIcon icon={key} size={36} />,
                        primary: EXCHANGE_PORFOLIO_SOURCE[key],
                    },
                }))
        );
        setWalletOptions(
            Object.keys(WALLET_PORFOLIO_SOURCE)
                .sort()
                .map((key) => ({
                    key: key,
                    label: WALLET_PORFOLIO_SOURCE[key],
                    value: WALLET_PORFOLIO_SOURCE[key],
                    listItemSpecification: {
                        icon: <CryptoIcon icon={key.toLowerCase()} size={36} />,
                        onPress: () => {
                            handleModalClose();
                            navigation.pop();
                            navigation.navigate("Account", {
                                type: WALLET_PORFOLIO_SOURCE[key],
                            });
                        },
                        primary: WALLET_PORFOLIO_SOURCE[key],
                    },
                }))
        );
    }, [navigation, wrappedIds, handleModalClose]);

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    const handleManualTransactionPress = useCallback(() => {
        setManualTxModalOpen(true);
    }, []);

    const handleExchangePress = useCallback(() => {
        setExchangeModalOpen(true);
    }, []);

    const handleWalletPress = useCallback(() => {
        setWalletModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setManualTxModalOpen(false);
        setExchangeModalOpen(false);
        setWalletModalOpen(false);
    }, []);

    const handleManualTxAssetSelection = useCallback(
        (asset) => {
            navigation.pop();
            navigation.navigate("Manual transaction", {
                symbol: asset.label,
                coinGeckoId: asset.key,
            });
        },
        [navigation]
    );

    const handleExchangeSelection = useCallback(
        (exchange) => {
            navigation.pop();
            navigation.navigate("Account", {
                type: EXCHANGE_PORFOLIO_SOURCE[exchange.key],
            });
        },
        [navigation]
    );

    const handleWalletSelection = useCallback(
        (wallet) => {
            navigation.pop();
            navigation.navigate("Account", {
                type: WALLET_PORFOLIO_SOURCE[wallet.key],
            });
        },
        [navigation]
    );

    return (
        <>
            <View style={styles.root}>
                <AppTitle
                    title="Choose an option"
                    closeable
                    onClose={handleClose}
                />
                <View style={styles.optionContainer}>
                    <AddOption
                        title="Manual transaction"
                        subtitle="Just a simple form to manually fill"
                        onPress={handleManualTransactionPress}
                    />
                </View>
                <View style={styles.optionContainer}>
                    <AddOption
                        title="Connect exchange"
                        subtitle="Pull data directly from the source"
                        onPress={handleExchangePress}
                    />
                </View>
                <View style={styles.optionContainer}>
                    <AddOption
                        title="Connect wallet"
                        subtitle="Autosync from your crypto wallets"
                        onPress={handleWalletPress}
                    />
                </View>
                <Select
                    hidden
                    searchable
                    options={assetOptions}
                    onChange={handleManualTxAssetSelection}
                    open={manualTxModalOpen}
                    onClose={handleModalClose}
                />
                <Select
                    hidden
                    searchable
                    options={exchangeOptions}
                    onChange={handleExchangeSelection}
                    open={exchangeModalOpen}
                    onClose={handleModalClose}
                />
                <Select
                    hidden
                    searchable
                    options={walletOptions}
                    onChange={handleWalletSelection}
                    open={walletModalOpen}
                    onClose={handleModalClose}
                />
            </View>
        </>
    );
};
