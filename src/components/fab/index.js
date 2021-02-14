import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

export const Fab = ({ icon, onPress }) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            width: 56,
            height: 56,
            backgroundColor: theme.primary,
            color: theme.textInverted,
            elevation: 8,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.root}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[theme.primary, theme.primaryDarkMode]}
                style={styles.root}
            >
                {icon}
            </LinearGradient>
        </TouchableOpacity>
    );
};

Fab.propTypes = {
    icon: PropTypes.object.isRequired,
    onPress: PropTypes.func,
};
