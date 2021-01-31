import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const ActionButton = ({ onPress, disabled, role }) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            paddingVertical: 11,
            paddingHorizontal: 13,
            borderWidth: 1,
            borderColor: role === "confirm" ? "green" : "red",
        },
    });

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={styles.container}
        >
            {role === "confirm" && <Text>Confirm</Text>}
            {role === "delete" && <Text>Delete</Text>}
        </TouchableOpacity>
    );
};

ActionButton.propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    role: PropTypes.string,
};
