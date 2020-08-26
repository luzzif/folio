import React, { useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Switch } from "../../components/switch";
import { toggleDarkMode, changeFiatCurrency } from "../../actions/settings";
import { version } from "../../../package.json";
import { Chip } from "../../components/chip";

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
        },
        rightSpacer: {
            marginRight: 16,
        },
    });

    const handleDarkModeToggle = useCallback(() => {
        dispatch(toggleDarkMode());
    }, [dispatch]);

    const getFiatCurrencyChangeHandler = (currency) => () => {
        dispatch(changeFiatCurrency(currency));
    };

    return (
        <View style={styles.root}>
            <List
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
                            <Chip
                                text="₿"
                                active={fiatCurrency === "btc"}
                                onPress={getFiatCurrencyChangeHandler("btc")}
                            />,
                            <Chip
                                text="$"
                                active={fiatCurrency === "usd"}
                                onPress={getFiatCurrencyChangeHandler("usd")}
                            />,
                            <Chip
                                text="€"
                                active={fiatCurrency === "eur"}
                                onPress={getFiatCurrencyChangeHandler("eur")}
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
