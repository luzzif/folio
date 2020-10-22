import React, { useCallback, useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Switch } from "../../components/switch";
import {
    toggleDarkMode,
    changeFiatCurrency,
    importSettings,
} from "../../actions/settings";
import { importManualTransactions } from "../../actions/manual-transaction";
import { importAccounts } from "../../actions/accounts";
import { version } from "../../../package.json";
import { Select } from "../../components/select";
import { Button } from "../../components/button";
import { faDollarSign, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Clipboard from "@react-native-community/clipboard";

export const Settings = () => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { darkMode, fiatCurrency } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
        fiatCurrency: state.settings.fiatCurrency,
    }));

    const { accounts, manualTransactions, settings } = useSelector((state) => ({
        accounts: state.accounts,
        manualTransactions: state.manualTransactions,
        settings: state.settings,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 12,
        },
        rightSpacer: {
            marginRight: 16,
        },
        conversionCurrencyIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primary,
        },
    });

    const handleDarkModeToggle = useCallback(() => {
        dispatch(toggleDarkMode());
    }, [dispatch]);

    const handleConversionCurrencyChange = useCallback(
        (currency) => {
            dispatch(changeFiatCurrency(currency.value));
        },
        [dispatch]
    );

    const handlePortfolioImport = async () => {
        let portfolio;
        try {
            portfolio = JSON.parse(await Clipboard.getString());
        } catch (error) {
            ToastAndroid.show("Portfolio state not valid", ToastAndroid.SHORT);
            return;
        }

        if (
            !portfolio.accounts ||
            !portfolio.settings ||
            !portfolio.manualTransactions
        ) {
            ToastAndroid.show("Portfolio state not valid", ToastAndroid.SHORT);
            return;
        }

        dispatch(importAccounts(portfolio.accounts));
        dispatch(importSettings(portfolio.settings));
        dispatch(importManualTransactions(portfolio.manualTransactions));

        ToastAndroid.show("Portfolio imported", ToastAndroid.SHORT);
    };

    const handlePortfolioExport = () => {
        Clipboard.setString(
            JSON.stringify({ accounts, manualTransactions, settings })
        );
        ToastAndroid.show(
            "Portfolio state copied to clipboard",
            ToastAndroid.SHORT
        );
    };

    return (
        <View style={styles.root}>
            <List
                header="Settings"
                items={[
                    {
                        key: "darkMode",
                        primary: "Dark mode",
                        actions: [
                            <Switch
                                value={darkMode}
                                onChange={handleDarkModeToggle}
                            />,
                        ],
                    },
                    {
                        key: "fiatCurrency",
                        primary: "Conversion currency",
                        actions: [
                            <Select
                                searchable
                                value={fiatCurrency}
                                onChange={handleConversionCurrencyChange}
                                options={[
                                    {
                                        value: "usd",
                                        label: "USD",
                                        listItemSpecification: {
                                            primary: "USD",
                                            icon: (
                                                <View
                                                    style={
                                                        styles.conversionCurrencyIconContainer
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faDollarSign}
                                                        style={styles.icon}
                                                        color={theme.background}
                                                        size={20}
                                                    />
                                                </View>
                                            ),
                                        },
                                    },
                                    {
                                        value: "eur",
                                        label: "EUR",
                                        listItemSpecification: {
                                            primary: "EUR",
                                            icon: (
                                                <View
                                                    style={
                                                        styles.conversionCurrencyIconContainer
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEuroSign}
                                                        color={theme.background}
                                                        size={20}
                                                    />
                                                </View>
                                            ),
                                        },
                                    },
                                    {
                                        value: "btc",
                                        label: "BTC",
                                        listItemSpecification: {
                                            primary: "BTC",
                                            icon: (
                                                <View
                                                    style={
                                                        styles.conversionCurrencyIconContainer
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faBitcoin}
                                                        color={theme.background}
                                                        size={20}
                                                    />
                                                </View>
                                            ),
                                        },
                                    },
                                    {
                                        value: "eth",
                                        label: "ETH",
                                        listItemSpecification: {
                                            primary: "ETH",
                                            icon: (
                                                <View
                                                    style={
                                                        styles.conversionCurrencyIconContainer
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEthereum}
                                                        color={theme.background}
                                                        size={20}
                                                    />
                                                </View>
                                            ),
                                        },
                                    },
                                ]}
                            />,
                        ],
                    },
                    {
                        key: "export",
                        primary: "Export the portfolio",
                        actions: [
                            <Button
                                title="Export"
                                onPress={handlePortfolioExport}
                            />,
                        ],
                    },
                    {
                        key: "import",
                        primary: "Import the portfolio",
                        actions: [
                            <Button
                                title="Import"
                                onPress={handlePortfolioImport}
                            />,
                        ],
                    },
                    {
                        key: "version",
                        primary: "Version",
                        tertiary: version,
                    },
                ]}
            />
        </View>
    );
};
