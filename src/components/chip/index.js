import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { ThemeContext } from "../../contexts/theme";

const commonContainerStyles = {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
};

export const Chip = ({ text, active, onPress }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            ...commonContainerStyles,
            justifyContent: "center",
            backgroundColor: active ? theme.primary : theme.background,
            borderColor: active ? theme.primary : theme.border,
        },
        title: {
            fontFamily: "Montserrat-Medium",
            fontSize: 12,
            color: active ? theme.textInverted : theme.text,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.root}>
            <Text style={styles.title}>{text}</Text>
        </TouchableOpacity>
    );
};

Chip.propTypes = {
    text: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};
