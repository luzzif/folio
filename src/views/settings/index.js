import React, { useCallback, useState } from "react";
import { Linking, Text, ToastAndroid } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Switch } from "../../components/switch";
import {
    toggleDarkMode,
    changeFiatCurrency,
    importSettings,
} from "../../actions/settings";
import { importManualTransactions } from "../../actions/manual-transaction";
import { importAccounts } from "../../actions/accounts";
import { version } from "../../../package.json";
import { Button } from "../../components/button";
import ChevronRight from "../../../assets/svg/chevron-right.svg";
import Clipboard from "@react-native-community/clipboard";
import { AppTitle } from "../../components/app-title";
import { CryptoIcon } from "../../components/crypto-icon";
import { Select } from "../../components/select";
import { Modal } from "../../components/modal";

export const Settings = ({ navigation }) => {
    const { colors: theme } = useTheme();
    const dispatch = useDispatch();
    const {
        darkMode,
        fiatCurrency,
        isPinEnabled,
        accounts,
        manualTransactions,
        settings,
    } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
        fiatCurrency: state.settings.fiatCurrency,
        isPinEnabled: state.pinConfig.isEnabled,
        manualTransactions: state.manualTransactions,
        accounts: state.accounts,
        settings: state.settings,
    }));

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
    const [confirmationModalMessage, setConfirmationModalMessage] = useState(
        ""
    );
    const [
        confirmationModalCallback,
        setConfirmationModalCallback,
    ] = useState(() => {});

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
        },
        spacer: {
            height: 12,
        },
        conversionCurrencyIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primary,
        },
        itemMainText: {
            fontFamily: "Poppins-Regular",
            color: theme.text,
            fontSize: 14,
            letterSpacing: 0.75,
        },
        versionTextContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
        },
        versionText: {
            fontFamily: "Poppins-Bold",
            color: theme.primary,
            fontSize: 13,
            letterSpacing: 0.75,
        },
        rightSpacer: {
            marginRight: 16,
        },
        modalRoot: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        modalText: {
            color: theme.text,
            fontFamily: "Poppins-Regular",
            marginBottom: 24,
        },
        modalButtonsContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
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

        handleConfirmationModalClose();

        ToastAndroid.show("Portfolio imported", ToastAndroid.SHORT);
    };

    const handlePortfolioExport = () => {
        Clipboard.setString(
            JSON.stringify({ accounts, manualTransactions, settings })
        );

        handleConfirmationModalClose();

        ToastAndroid.show(
            "Portfolio state copied to clipboard",
            ToastAndroid.SHORT
        );
    };

    const handlePinCreation = () => {
        navigation.navigate("Pin lock", {
            action: isPinEnabled ? "disable" : "capture",
        });
    };

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    const handleWalletConnectionsPress = useCallback(() => {
        navigation.navigate("Accounts");
    }, [navigation]);

    const handleConfirmationModalClose = useCallback(() => {
        setConfirmationModalOpen(false);
    }, []);

    const getConfirmationModalOpenHandler = (
        title,
        message,
        callback
    ) => () => {
        setConfirmationModalTitle(title);
        setConfirmationModalMessage(message);
        setConfirmationModalCallback(callback);
        setConfirmationModalOpen(true);
    };

    const handleSourceCodePress = useCallback(() => {
        Linking.openURL("https://github.com/luzzif/folio");
    }, []);

    return (
        <>
            <View style={styles.root}>
                <AppTitle title="Settings" closeable onClose={handleClose} />
                <View style={styles.spacer} />
                <List
                    height={140}
                    header="General"
                    items={[
                        {
                            key: "theme",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Dark mode
                                    </Text>
                                </View>
                            ),
                            actions: [
                                <Switch
                                    value={darkMode}
                                    onChange={handleDarkModeToggle}
                                />,
                            ],
                            height: 40,
                        },
                        {
                            key: "fiatCurrency",
                            height: 40,
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Conversion currency
                                    </Text>
                                </View>
                            ),
                            actions: [
                                <Select
                                    small
                                    naked
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
                                                    <CryptoIcon
                                                        size={36}
                                                        icon="usd"
                                                    />
                                                ),
                                            },
                                        },
                                        {
                                            value: "eur",
                                            label: "EUR",
                                            listItemSpecification: {
                                                primary: "EUR",
                                                icon: (
                                                    <CryptoIcon
                                                        size={36}
                                                        icon="eur"
                                                    />
                                                ),
                                            },
                                        },
                                        {
                                            value: "btc",
                                            label: "BTC",
                                            listItemSpecification: {
                                                primary: "BTC",
                                                icon: (
                                                    <CryptoIcon
                                                        size={36}
                                                        icon="btc"
                                                    />
                                                ),
                                            },
                                        },
                                        {
                                            value: "eth",
                                            label: "ETH",
                                            listItemSpecification: {
                                                primary: "ETH",
                                                icon: (
                                                    <CryptoIcon
                                                        size={36}
                                                        icon="eth"
                                                    />
                                                ),
                                            },
                                        },
                                    ]}
                                />,
                                <ChevronRight width={16} height={16} />,
                            ],
                        },
                    ]}
                />
                <List
                    height={100}
                    header="Security"
                    items={[
                        {
                            key: "passcode",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Passcode lock
                                    </Text>
                                </View>
                            ),
                            height: 40,
                            actions: [
                                <Switch
                                    value={isPinEnabled}
                                    onChange={handlePinCreation}
                                />,
                            ],
                        },
                    ]}
                />
                <List
                    header="Account"
                    height={100}
                    items={[
                        {
                            key: "wallet-connections",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Connected accounts
                                    </Text>
                                </View>
                            ),
                            height: 40,
                            actions: [<ChevronRight width={16} height={16} />],
                            onPress: handleWalletConnectionsPress,
                        },
                    ]}
                />
                <List
                    height={140}
                    header="Data"
                    items={[
                        {
                            key: "export-data",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Export JSON
                                    </Text>
                                </View>
                            ),
                            height: 40,
                            actions: [<ChevronRight width={16} height={16} />],
                            onPress: getConfirmationModalOpenHandler(
                                "Export as JSON",
                                "Are you sure you want to export your portfolio to a JSON file?",
                                () => handlePortfolioExport
                            ),
                        },
                        {
                            key: "import-data",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Import JSON
                                    </Text>
                                </View>
                            ),
                            height: 40,
                            actions: [<ChevronRight width={16} height={16} />],
                            onPress: getConfirmationModalOpenHandler(
                                "Import as JSON",
                                "Are you sure you want to import your portfolio from a JSON file?",
                                () => handlePortfolioImport
                            ),
                        },
                    ]}
                />
                <List
                    height={100}
                    header="About"
                    items={[
                        {
                            key: "source-code",
                            primary: (
                                <View>
                                    <Text style={styles.itemMainText}>
                                        Source code
                                    </Text>
                                </View>
                            ),
                            height: 40,
                            actions: [<ChevronRight width={16} height={16} />],
                            onPress: handleSourceCodePress,
                        },
                    ]}
                />
                <View style={styles.versionTextContainer}>
                    <Text style={styles.versionText}>Version {version}</Text>
                </View>
            </View>
            <Modal
                title={confirmationModalTitle}
                open={confirmationModalOpen}
                onClose={handleConfirmationModalClose}
            >
                <View style={styles.modalRoot}>
                    <Text style={styles.modalText}>
                        {confirmationModalMessage}
                    </Text>
                    <View style={styles.modalButtonsContainer}>
                        <View style={styles.rightSpacer}>
                            <Button
                                secondary
                                title="Cancel"
                                onPress={handleConfirmationModalClose}
                            />
                        </View>
                        <Button
                            title="Confirm"
                            onPress={confirmationModalCallback}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};
