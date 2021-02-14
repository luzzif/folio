import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import CheckWhiteIcon from "../../../../assets/svg/check-white.svg";
import BackArrowWhiteIcon from "../../../../assets/svg/back-arrow-white.svg";

export const ActionButton = ({ onPress, disabled, role }) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            padding: 12,
            backgroundColor: role === "confirm" ? theme.success : theme.error,
        },
    });

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={styles.container}
        >
            {role === "confirm" && <CheckWhiteIcon />}
            {role === "delete" && <BackArrowWhiteIcon />}
        </TouchableOpacity>
    );
};

ActionButton.propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    role: PropTypes.string,
};
