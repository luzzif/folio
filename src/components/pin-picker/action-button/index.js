import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
            {role === "confirm" && (
                <FontAwesomeIcon icon={faCheck} color={"green"} />
            )}
            {role === "delete" && (
                <FontAwesomeIcon icon={faArrowLeft} color={"red"} />
            )}
        </TouchableOpacity>
    );
};

ActionButton.propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    role: PropTypes.string,
};
