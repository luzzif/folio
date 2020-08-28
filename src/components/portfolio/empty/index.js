import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import Spinner from "react-native-spinkit";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSadCry } from "@fortawesome/free-solid-svg-icons";

export const EmptyPortfolio = ({ loading }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        },
        icon: {
            color: theme.text,
            marginBottom: 28,
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
    });

    return (
        <View style={styles.root}>
            {loading ? (
                <Spinner type="Bounce" size={60} color={theme.primary} />
            ) : (
                <>
                    <FontAwesomeIcon
                        icon={faSadCry}
                        style={styles.icon}
                        size={80}
                    />
                    <View style={styles.centeredTextContainer}>
                        <Text style={styles.contentText}>
                            You need to add one or more accounts in the accounts
                            section in order to start tracking your portfolio.
                        </Text>
                    </View>
                </>
            )}
        </View>
    );
};

EmptyPortfolio.propTypes = {
    loading: PropTypes.bool.isRequired,
};
