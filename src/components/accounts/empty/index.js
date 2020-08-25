import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, Image } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import illustration from "../../../images/empty-portfolio-illustration.png";
import { Button } from "../../button";

export const EmptyAccounts = ({ onAddAccountPress }) => {
    const theme = useContext(ThemeContext);

    const [styles] = useState(
        StyleSheet.create({
            root: {
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            },
            illustration: {
                width: 140,
                height: 140,
                marginBottom: 28,
                resizeMode: "contain",
            },
            centeredTextContainer: {
                width: "50%",
                marginBottom: 36,
            },
            contentText: {
                fontFamily: "Montserrat-Medium",
                textAlignVertical: "center",
                textAlign: "center",
                color: theme.text,
            },
        })
    );

    return (
        <View style={styles.root}>
            <Image source={illustration} style={styles.illustration} />
            <View style={styles.centeredTextContainer}>
                <Text style={styles.contentText}>
                    There's still nothing here. Add an account by pressing the
                    button below.
                </Text>
            </View>
            <Button title="Add an account" onPress={onAddAccountPress} />
        </View>
    );
};

EmptyAccounts.propTypes = {
    onAddAccountPress: PropTypes.func.isRequired,
};
