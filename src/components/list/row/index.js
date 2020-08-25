import React, { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../../contexts/theme";

export const Row = ({ icon, primary, secondary, tertiary, quaternary }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 12,
        },
        leftBlock: {
            flexDirection: "row",
            alignItems: "center",
        },
        rightBlock: {
            alignItems: "flex-end",
        },
        iconContainer: {
            marginRight: 16,
        },
        mainText: {
            fontFamily: "Montserrat-Medium",
            fontSize: 16,
            color: theme.text,
        },
        lightText: {
            fontFamily: "Montserrat-Medium",
            fontSize: 12,
            color: theme.textLight,
        },
    });

    return (
        <View style={styles.root}>
            <View style={styles.leftBlock}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                {(primary || secondary) && (
                    <View>
                        {primary && (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.mainText}
                            >
                                {primary}
                            </Text>
                        )}
                        {secondary && (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.lightText}
                            >
                                {secondary}
                            </Text>
                        )}
                    </View>
                )}
            </View>
            {(tertiary || quaternary) && (
                <View style={styles.rightBlock}>
                    {tertiary && (
                        <Text style={styles.mainText}>{tertiary}</Text>
                    )}
                    {quaternary && (
                        <Text style={styles.lightText}>{quaternary}</Text>
                    )}
                </View>
            )}
        </View>
    );
};
