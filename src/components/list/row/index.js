import React, { useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../../contexts/theme";

export const Row = ({
    icon,
    primary,
    secondary,
    tertiary,
    quaternary,
    actions,
    onPress,
}) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            height: 56,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 12,
        },
        leftBlock: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        primarySecondaryContainer: {
            flex: 1,
        },
        rightBlock: {
            alignItems: "flex-end",
        },
        iconContainer: {
            marginRight: 16,
        },
        mainText: {
            fontFamily: "Nunito-Regular",
            fontSize: 16,
            color: theme.text,
        },
        lightText: {
            fontFamily: "Nunito-Regular",
            fontSize: 12,
            color: theme.textLight,
        },
        actionsContainer: {
            flexDirection: "row",
        },
        rightSpacer: {
            marginRight: 12,
        },
    });

    return (
        <TouchableOpacity disabled={!onPress} onPress={onPress}>
            <View style={styles.root}>
                <View style={styles.leftBlock}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    {(primary || secondary) && (
                        <View style={styles.primarySecondaryContainer}>
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
                {(!actions || actions.length === 0) &&
                    (tertiary || quaternary) && (
                        <View style={styles.rightBlock}>
                            {tertiary && (
                                <Text style={styles.mainText}>{tertiary}</Text>
                            )}
                            {quaternary && (
                                <Text style={styles.lightText}>
                                    {quaternary}
                                </Text>
                            )}
                        </View>
                    )}
                {actions && actions.length > 0 && !tertiary && !quaternary && (
                    <View style={styles.actionsContainer}>
                        {actions.map((action, index) => (
                            <View
                                style={
                                    index < actions.length - 1 &&
                                    styles.rightSpacer
                                }
                            >
                                {action}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
