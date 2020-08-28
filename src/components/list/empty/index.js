import React, { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSadCry } from "@fortawesome/free-solid-svg-icons";

export const Empty = () => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        },
        icon: {
            color: theme.text,
            marginBottom: 28,
        },
        centeredTextContainer: {
            width: "50%",
            marginBottom: 36,
        },
        contentText: {
            fontFamily: "Montserrat-Medium",
            textAlignVertical: "center",
            textAlign: "center",
            color: theme.text,
        },
    });

    return (
        <View style={styles.root}>
            <FontAwesomeIcon icon={faSadCry} style={styles.icon} size={80} />
            <View style={styles.centeredTextContainer}>
                <Text style={styles.contentText}>There's nothing here.</Text>
            </View>
        </View>
    );
};
