import React, { useState, useEffect } from "react";
import { ThemeProvider } from "../../contexts/theme";
import { StatusBar } from "react-native";
import { StackSwitcher } from "../../components/stack-switcher";
import { Account } from "../accounts/account";
import { Home } from "../../components/home";
import { CoinSplit } from "../../components/coin-split";
import { useSelector } from "react-redux";
import { ManualTransaction } from "../manual-transaction";
import { ManualTransactions } from "../manual-transactions";
import SplashScreen from "react-native-splash-screen";

const commonColors = {
    error: "#c62828",
    warning: "#FF6F00",
    success: "#00c853",
    disabled: "rgb(202, 209, 213)",
    textButton: "#d6e0ff",
};

const themes = {
    light: {
        ...commonColors,
        background: "#e0e0e0",
        disabled: "#bfbfbf",
        foreground: "#f2f2f2",
        textDisabled: "#8c8c8c",
        primary: "#333",
        border: "#bfbfbf",
        textLight: "#999999",
        text: "#0e062d",
        textInverted: "#F1F9D2",
        shadow: "rgba(0, 0, 0, 0.4)",
        placeholder: "#999999",
    },
    dark: {
        ...commonColors,
        background: "#212121",
        foreground: "#333",
        textDisabled: "#808080",
        disabled: "#4d4d4d",
        primary: "#f2f2f2",
        border: "#3a3f45",
        textLight: "#737373",
        text: "#F1F9D2",
        textInverted: "#0e062d",
        shadow: "rgba(255, 255, 255, 0.1)",
        placeholder: "#737373",
    },
};

export const App = () => {
    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const [theme, setTheme] = useState(themes.light);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        setTheme(darkMode ? themes.dark : themes.light);
    }, [darkMode]);

    return (
        <ThemeProvider value={theme}>
            <StatusBar
                backgroundColor={theme.foreground}
                barStyle={`${darkMode ? "light" : "dark"}-content`}
            />
            <StackSwitcher
                items={[
                    {
                        name: "Dashboard",
                        component: Home,
                    },
                    {
                        name: "Account",
                        component: Account,
                        allowClose: true,
                    },
                    {
                        name: "Coin split",
                        component: CoinSplit,
                        allowClose: true,
                    },
                    {
                        name: "Manual transaction",
                        component: ManualTransaction,
                        allowClose: true,
                    },
                    {
                        name: "Manual transactions",
                        component: ManualTransactions,
                        allowClose: true,
                    },
                ]}
            />
        </ThemeProvider>
    );
};
