import React from "react";
import PropTypes from "prop-types";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export const Input = ({
    label,
    required,
    disabled,
    value,
    validate,
    valid,
    small,
    naked,
    ...rest
}) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            paddingHorizontal: naked ? 0 : 24,
            height: small ? 20 : 40,
            backgroundColor: naked ? "rgba(0, 0, 0, 0)" : theme.inputBackground,
            borderRadius: 16,
            flexDirection: "row",
        },
        text: {
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: theme.text,
        },
        textInput: {
            fontFamily: "Poppins-Regular",
            paddingTop: 4,
            fontSize: 16,
            padding: 0,
            color: theme.text,
            flex: 1,
        },
        label: {
            fontFamily: "Poppins-Bold",
            fontSize: 16,
            color: theme.text,
        },
    });

    return (
        <>
            <View style={styles.root}>
                {disabled ? (
                    <Text style={styles.text}>{value}</Text>
                ) : (
                    <TextInput
                        style={styles.textInput}
                        {...rest}
                        value={value}
                        placeholderTextColor={theme.placeholder}
                    />
                )}
            </View>
        </>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
};
