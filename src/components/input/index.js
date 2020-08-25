import React, { useContext } from "react";
import PropTypes from "prop-types";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";

export const Input = ({ label, required, ...rest }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            justifyContent: "center",
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
        },
        text: {
            fontFamily: "Montserrat-Medium",
            fontSize: 16,
            color: theme.text,
        },
        label: {
            fontFamily: "Montserrat-Bold",
            fontSize: 12,
            color: theme.text,
            marginBottom: 8,
            marginLeft: 16,
        },
    });

    return (
        <>
            {label && (
                <Text style={styles.label}>
                    {label} {required ? "*" : ""}
                </Text>
            )}
            <View style={styles.root}>
                <TextInput
                    style={styles.text}
                    {...rest}
                    placeholderTextColor={theme.placeholder}
                />
            </View>
        </>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
};
