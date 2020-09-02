import React, { useContext } from "react";
import PropTypes from "prop-types";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export const Input = ({
    label,
    required,
    disabled,
    value,
    faIcon,
    ...rest
}) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            justifyContent: "space-between",
            paddingHorizontal: 12,
            height: 40,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
        },
        text: {
            fontFamily: "Nunito-Regular",
            fontSize: 16,
            color: theme.text,
        },
        textInput: {
            fontFamily: "Nunito-Regular",
            fontSize: 16,
            height: 48,
            color: theme.text,
            flex: 1,
        },
        label: {
            fontFamily: "Nunito-Bold",
            fontSize: 12,
            color: theme.text,
            marginBottom: 8,
            marginLeft: 16,
        },
        iconContainer: {
            height: "100%",
            justifyContent: "center",
            paddingLeft: 16,
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
                {faIcon && (
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon
                            icon={faIcon}
                            color={theme.text}
                            size={20}
                        />
                    </View>
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
    faIcon: PropTypes.object,
};
