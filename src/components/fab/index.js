import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export const Fab = ({ faIcon, onPress }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            width: 52,
            height: 52,
            backgroundColor: theme.primary,
            color: theme.textInverted,
            elevation: 12,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.root}>
            <FontAwesomeIcon
                color={theme.textInverted}
                icon={faIcon}
                size={24}
            />
        </TouchableOpacity>
    );
};

Fab.propTypes = {
    faIcon: PropTypes.object.isRequired,
    onPress: PropTypes.func,
};
