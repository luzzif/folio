import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import CloseBlackIcon from "../../../assets/svg/close-black.svg";
import CloseWhiteIcon from "../../../assets/svg/close-white.svg";

export const AppTitle = ({ title, actions = [], closeable, onClose }) => {
    const { dark, colors: theme } = useTheme();

    const styles = StyleSheet.create({
        titleContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 24,
            marginBottom: 16,
        },
        titleText: {
            fontFamily: "Poppins-Bold",
            maxWidth: "80%",
            fontSize: 24,
            lineHeight: 28,
            color: theme.text,
        },
    });

    return (
        <View style={styles.titleContainer}>
            <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <TouchableOpacity key={index} onPress={action.onPress}>
                        <Icon width={20} height={20} />
                    </TouchableOpacity>
                );
            })}
            {closeable && (
                <TouchableOpacity onPress={onClose}>
                    {dark ? (
                        <CloseWhiteIcon width={20} height={20} />
                    ) : (
                        <CloseBlackIcon width={20} height={20} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};
