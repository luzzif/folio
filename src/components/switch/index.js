import React from "react";
import ToggleSwitch from "toggle-switch-react-native";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export const Switch = ({ value, onChange }) => {
    const { colors: theme } = useTheme();

    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const styles = StyleSheet.create({
        thumb: {
            backgroundColor: theme.background,
        },
    });

    return (
        <ToggleSwitch
            isOn={value}
            onToggle={onChange}
            onColor={darkMode ? theme.primaryDarkMode : theme.primary}
            offColor={theme.disabled}
            thumbOnStyle={styles.thumb}
            thumbOffStyle={styles.thumb}
        />
    );
};
