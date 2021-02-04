import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

export const AddOption = ({ title, subtitle, onPress }) => {
    const { colors: theme } = useTheme();

    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            paddingVertical: 20,
            paddingHorizontal: 16,
            borderRadius: 16,
        },
        elevatedContainer: {
            backgroundColor: theme.primary,
            borderRadius: 16,
            elevation: 8,
        },
        titleText: {
            fontFamily: "Poppins-Bold",
            color: theme.white,
            fontSize: 20,
            lineHeight: 26,
            letterSpacing: 1,
        },
        subtitleText: {
            fontFamily: "Poppins-Regular",
            color: theme.primaryLight,
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.25,
        },
    });

    return (
        <View style={styles.elevatedContainer}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1.9, y: 1.9 }}
                colors={[
                    theme.primary,
                    darkMode ? theme.primaryDarkMode : theme.primary,
                ]}
                style={styles.root}
            >
                <TouchableOpacity onPress={onPress}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.subtitleText}>{subtitle}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};
