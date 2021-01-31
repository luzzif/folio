import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import EmptyIllustration from "../../../../assets/svg/empty-illustration.svg";

export const Empty = () => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        },
        centeredTextContainer: {
            width: "50%",
            marginBottom: 80,
        },
        contentText: {
            fontFamily: "Poppins-Regular",
            textAlignVertical: "center",
            textAlign: "center",
            color: theme.text,
            marginTop: 16,
        },
    });

    return (
        <View style={styles.root}>
            <EmptyIllustration width={150} height={150} />
            <View style={styles.centeredTextContainer}>
                <Text style={styles.contentText}>
                    There's nothing here... yet.
                </Text>
            </View>
        </View>
    );
};
