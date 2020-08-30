import React, { useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Switch } from "../../components/switch";
import { toggleDarkMode, changeFiatCurrency } from "../../actions/settings";
import { version } from "../../../package.json";
import { Select } from "../../components/select";
import { faDollarSign, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export const Settings = () => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { darkMode, fiatCurrency } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
        fiatCurrency: state.settings.fiatCurrency,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 16,
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
                                ]}
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
