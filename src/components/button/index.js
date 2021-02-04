import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const commonContainerStyles = {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    paddingHorizontal: 20,
};

const commonTextStyles = {
    fontFamily: "Poppins-Bold",
};

export const Button = ({ title, onPress, disabled, secondary, small }) => {
    const { colors: theme } = useTheme();

    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const styles = StyleSheet.create({
        primaryContainer: {
            ...commonContainerStyles,
            height: 40,
        },
        secondaryContainer: {
            ...commonContainerStyles,
            borderWidth: 1,
            height: 40,
            borderColor: darkMode ? theme.primaryDarkMode : theme.primary,
        },
        primaryText: {
            ...commonTextStyles,
            color: theme.white,
            fontSize: 16,
            letterSpacing: 0.75,
        },
        secondaryText: {
            ...commonTextStyles,
            color: darkMode ? theme.primaryDarkMode : theme.primary,
        },
    });

    const getGradientColors = () => {
        if (disabled) {
            return [theme.disabled, theme.disabled];
        }
        if (secondary) {
            return [theme.background, theme.background];
        }
        return [theme.primary, theme.primaryDarkMode];
    };

    return (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={getGradientColors()}
                style={
                    secondary
                        ? styles.secondaryContainer
                        : styles.primaryContainer
                }
            >
                <Text
                    style={
                        secondary ? styles.secondaryText : styles.primaryText
                    }
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

Button.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    secondary: PropTypes.bool,
    fab: PropTypes.bool,
};
