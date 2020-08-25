import React, { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../../contexts/theme";

export const Row = ({
    icon,
    primary,
    secondary,
    tertiary,
    quaternary,
    actions,
}) => {
    const theme = useContext(ThemeContext);

    const commonsMainText = {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        color: theme.text,
    };

    const commonsLightText = {
        fontFamily: "Montserrat-Medium",
        fontSize: 12,
        color: theme.textLight,
    };

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
            flex: 1,
        },
        rightBlock: {
            alignItems: "flex-end",
        },
        iconContainer: {
            marginRight: 16,
        },
        leftMainText: {
            ...commonsMainText,
            paddingRight: 20,
            flex: 1,
        },
        leftLightText: {
            ...commonsLightText,
            paddingRight: 20,
            flex: 1,
        },
        rightMainText: {
            ...commonsMainText,
        },
        rightLightText: {
            ...commonsLightText,
        },
        actionsContainer: {
            flexDirection: "row",
        },
        rightSpacer: {
            marginRight: 12,
        },
    });

    return (
        <View style={styles.root}>
            <View style={styles.leftBlock}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                {(primary || secondary) && (
                    <>
                        {primary && (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.leftMainText}
                            >
                                {primary}
                            </Text>
                        )}
                        {secondary && (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.leftLightText}
                            >
                                {secondary}
                            </Text>
                        )}
                    </>
                )}
            </View>
            {(!actions || actions.length === 0) && (tertiary || quaternary) && (
                <View style={styles.rightBlock}>
                    {tertiary && (
                        <Text style={styles.rightMainText}>{tertiary}</Text>
                    )}
                    {quaternary && (
                        <Text style={styles.rightLightText}>{quaternary}</Text>
                    )}
                </View>
            )}
            {actions && actions.length > 0 && !tertiary && !quaternary && (
                <View style={styles.actionsContainer}>
                    {actions.map((action, index) => (
                        <View
                            style={
                                index < actions.length - 1 && styles.rightSpacer
                            }
                        >
                            {action}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};
