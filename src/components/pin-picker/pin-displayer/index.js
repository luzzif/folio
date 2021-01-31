import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@react-navigation/native";

export const PinDisplayer = ({ length, maximumLength }) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            height: 12,
            display: "flex",
            flexDirection: "row",
            maxWidth: 250,
        },
        circleFull: {
            marginRight: 4,
            marginLeft: 4,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.text,
        },
        circleEmpty: {
            marginRight: 4,
            marginLeft: 4,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.text,
        },
    });

    return (
        <View style={styles.root}>
            {Array.from({ length }, (_, key) => (
                <View key={key} style={styles.circleFull} />
            ))}
            {Array.from({ length: maximumLength - length }, (_, key) => (
                <View key={key} style={styles.circleEmpty} />
            ))}
        </View>
    );
};

PinDisplayer.propTypes = {
    length: PropTypes.number.isRequired,
    maximumLength: PropTypes.number.isRequired,
};
