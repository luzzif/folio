import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Row } from "./row";
import { ThemeContext } from "../../contexts/theme";

export const List = ({ header, items, onRefresh, refreshing }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            flex: 1,
        },
        list: {
            paddingHorizontal: 16,
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
            alignItems: "center",
        },
        headerText: {
            fontFamily: "Montserrat-SemiBold",
            fontSize: 16,
            marginLeft: 8,
            color: theme.text,
        },
        orderingText: {
            fontFamily: "Montserrat-Medium",
            fontSize: 12,
            marginRight: 8,
            color: theme.text,
        },
    });

    return (
        <View style={styles.root}>
            {header && (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{header}</Text>
                </View>
            )}
            <FlatList
                style={styles.list}
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => <Row {...item} />}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
};

List.propTypes = {
    header: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            primary: PropTypes.node,
            secondary: PropTypes.node,
            tertiary: PropTypes.node,
            quaternary: PropTypes.node,
        }).isRequired
    ).isRequired,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
};
