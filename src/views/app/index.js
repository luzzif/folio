import React, { useState, useRef, useEffect } from "react";
import { StatusBar, AppState } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useSelector, useDispatch } from "react-redux";
import { triggerPinVerify } from "../../actions/pin";
import { StackSwitcher } from "../../components/stack-switcher";
import { Account } from "../accounts/account";
import { CoinSplit } from "../../components/coin-split";
import { PinPicker } from "../../components/pin-picker";
import { ManualTransaction } from "../manual-transaction";
import { ManualTransactions } from "../manual-transactions";
import { PinLock } from "../pin-lock";
import { Settings } from "../settings";
import { NavigationContainer } from "@react-navigation/native";
import { Portfolio } from "../portfolio";
import { Accounts } from "../accounts";
import { AddChooser } from "../add-selector";

const commonColors = {
    warning: "#FF6F00",
    success: "#00BA88",
    successDark: "#00966D",
    successDarkMode: "#34EAB9",
    error: "#EB5757",
    errorDark: "#C30052",
    errorDarkMode: "#FF84B7",
    disabled: "rgb(202, 209, 213)",
    textButton: "#d6e0ff",
    primary: "#7B61FF",
    primaryLight: "#E4DAFF",
    primaryDark: "#2A00A2",
    primaryDarkMode: "#0D0B85",
    white: "#fff",
    placeholder: "#A0A3BD",
};

const themes = {
    light: {
        dark: false,
        colors: {
            ...commonColors,
            background: "#FEFBF9",
            card: "#FEFBF9",
            disabled: "#bfbfbf",
            foreground: "#f2f2f2",
            textDisabled: "#8c8c8c",
            border: "#AEA8B2",
            textLight: "#6E7191",
            text: "#0e062d",
            textInverted: "#F1F9D2",
            shadow: "rgba(0, 0, 0, 0.4)",
            inputBackground: "#EFF0F6",
        },
    },
    dark: {
        dark: true,
        colors: {
            ...commonColors,
            background: "#14142B",
            card: "#212121",
            foreground: "#333",
            textDisabled: "#808080",
            disabled: "#4d4d4d",
            border: "#AEA8B2",
            textLight: "#737373",
            text: "#F1F9D2",
            textInverted: "#0e062d",
            shadow: "rgba(255, 255, 255, 0.2)",
            inputBackground: "#4E4B66",
        },
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
    });

    useEffect(() => {
        SplashScreen.hide();
        dispatch(triggerPinVerify());
    }, [dispatch]);

    useEffect(() => {
        setTheme(darkMode ? themes.dark : themes.light);
    }, [darkMode]);

    const handleAppStateChange = (nextAppState) => {
        if (appState.current.match(/active/) && nextAppState === "background") {
            dispatch(triggerPinVerify());
        }

        appState.current = nextAppState;
    };

    return (
        <NavigationContainer theme={darkMode ? themes.dark : themes.light}>
            {isPinEnabled && isPinVerifying && !isPinVerified ? (
                <PinPicker status={"verify"} />
            ) : (
                <>
                    <StatusBar
                        backgroundColor={theme.colors.background}
                        barStyle={`${darkMode ? "light" : "dark"}-content`}
                    />
                    <StackSwitcher
                        items={[
                            {
                                name: "Portfolio",
                                component: Portfolio,
                            },
                            {
                                name: "Account",
                                component: Account,
                            },
                            {
                                name: "Coin split",
                                component: CoinSplit,
                            },
                            {
                                name: "Manual transaction",
                                component: ManualTransaction,
                            },
                            {
                                name: "Manual transactions",
                                component: ManualTransactions,
                            },
                            {
                                name: "Pin lock",
                                component: PinLock,
                            },
                            {
                                name: "Settings",
                                component: Settings,
                            },
                            {
                                name: "Accounts",
                                component: Accounts,
                            },
                            {
                                name: "Add chooser",
                                component: AddChooser,
                            },
                        ]}
                    />
                </>
            )}
        </NavigationContainer>
    );
};
