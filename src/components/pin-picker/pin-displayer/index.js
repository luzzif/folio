import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";

import { ThemeContext } from "../../../contexts/theme";

export const PinDisplayer = ({ length, maximumLength }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: 12,
            display: "flex",
            flexDirection: "row",
            maxWidth: 250,
        },
        dot: {
            marginRight: 4,
            marginLeft: 4,
        },
    });

    return (
        <View style={styles.root}>
            {Array.from({ length }, (_, key) => (
                <FontAwesomeIcon
                    key={key}
                    size={12}
                    icon={faCircle}
                    color={theme.text}
                    style={styles.dot}
                />
            ))}
            {Array.from({ length: maximumLength - length }, (_, key) => (
                <FontAwesomeIcon
                    key={key}
                    size={12}
                    icon={faWindowMinimize}
                    color={theme.text}
                    style={styles.dot}
                />
            ))}
        </View>
    );
};

PinDisplayer.propTypes = {
    length: PropTypes.number.isRequired,
    maximumLength: PropTypes.number.isRequired,
};
