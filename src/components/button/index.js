import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../contexts/theme";

const commonContainerStyles = {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
};

const commonTextStyles = {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
};

export const Button = ({ title, onPress, disabled, secondary }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        primaryContainer: {
            ...commonContainerStyles,
            backgroundColor: disabled ? theme.disabled : theme.primary,
        },
        secondaryContainer: {
            ...commonContainerStyles,
            borderWidth: 1,
            borderColor: theme.primary,
        },
        primaryText: {
            ...commonTextStyles,
            color: disabled ? theme.textDisabled : theme.textInverted,
        },
        secondaryText: {
            ...commonTextStyles,
            color: disabled ? theme.textDisabled : theme.primary,
        },
    });

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={
                secondary ? styles.secondaryContainer : styles.primaryContainer
            }
        >
            <Text
                style={secondary ? styles.secondaryText : styles.primaryText}
                numberOfLines={1}
            >
                {title}
            </Text>
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
