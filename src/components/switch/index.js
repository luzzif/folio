import React, { useContext } from "react";
import ToggleSwitch from "toggle-switch-react-native";
import { ThemeContext } from "../../contexts/theme";
import { StyleSheet } from "react-native";

export const Switch = ({ value, onChange }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        thumb: {
            backgroundColor: theme.background,
        },
    });

    return (
        <ToggleSwitch
            isOn={value}
            onToggle={onChange}
            onColor={theme.primary}
            offColor={theme.disabled}
            thumbOnStyle={styles.thumb}
            thumbOffStyle={styles.thumb}
        />
    );
};
