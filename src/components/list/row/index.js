import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

export const Row = ({
    icon,
    primary,
    secondary,
    tertiary,
    quaternary,
    actions,
    onPress,
    height,
}) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            height: height || 62,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
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
            fontFamily: "Poppins-Bold",
            fontSize: 16,
            color: theme.text,
        },
        lightText: {
            fontFamily: "Poppins-Regular",
            fontSize: 12,
            color: theme.textLight,
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
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
                                <Text
                                    numberOfLines={1}
                                    style={styles.mainText}
                                    ellipsizeMode="tail"
                                >
                                    {tertiary}
                                </Text>
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
                                key={index}
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
