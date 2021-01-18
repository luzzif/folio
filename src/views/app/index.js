import React, { useState, useRef, useEffect } from "react";
import { StatusBar, AppState } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useSelector, useDispatch } from "react-redux";

import { ThemeProvider } from "../../contexts/theme";
import { triggerPinVerify } from "../../actions/pin";
import { StackSwitcher } from "../../components/stack-switcher";
import { Account } from "../accounts/account";
import { Home } from "../../components/home";
import { CoinSplit } from "../../components/coin-split";
import { PinPicker } from "../../components/pin-picker";
import { ManualTransaction } from "../manual-transaction";
import { ManualTransactions } from "../manual-transactions";
import { PinLock } from "../pin-lock";

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
    const {
        darkMode,
        isPinVerified,
        isPinEnabled,
        isPinVerifying,
    } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
        existingPin: state.pinConfig.pin,
        isPinVerified: state.pinConfig.isVerified,
        isPinEnabled: state.pinConfig.isEnabled,
        isPinVerifying: state.pinConfig.isVerifying,
    }));

    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    const [theme, setTheme] = useState(themes.light);

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", handleAppStateChange);
        };
    }, []);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        setTheme(darkMode ? themes.dark : themes.light);
    }, [darkMode]);

    const handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/active/) &&
            nextAppState === "background"
        ) {
            dispatch(triggerPinVerify());
        }

        appState.current = nextAppState;
    };

    return (
        <ThemeProvider value={theme}>
            {isPinEnabled && isPinVerifying && !isPinVerified ?
                <PinPicker status={"verify"} />
                :
                <>
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
                            {
                                name: "Pin lock",
                                component: PinLock,
                                allowClose: true,
                            },
                        ]}
                    />
                </>}
        </ThemeProvider>
    );
};
