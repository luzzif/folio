import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Row } from "./row";
import { useTheme } from "@react-navigation/native";
import { Empty } from "./empty";

export const List = ({
    header,
    items,
    onRefresh,
    refreshing,
    bottomSpacing,
    height,
}) => {
    const { dark, colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            flex: height ? 0 : 1,
            height: height || "auto",
        },
        gradient: {
            width: "100%",
            height: 80,
        },
        list: {
            flex: 1,
        },
        listContentContainerStyle: {
            flex: 1,
            justifyContent: "center",
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
            marginLeft: 16,
            alignItems: "center",
            height: 16,
        },
        headerText: {
            fontFamily: "Poppins-Bold",
            fontSize: 13,
            lineHeight: 22,
            color: dark ? theme.primaryDarkMode : theme.primary,
            letterSpacing: 0.25,
        },
        orderingText: {
            fontFamily: "Poppins-Regular",
            fontSize: 12,
            marginRight: 8,
            color: theme.text,
        },
        bottomSpacedListContainer: {
            paddingBottom: bottomSpacing,
        },
    });

    return (
        <View style={styles.root}>
            {header && items.length > 0 && (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{header}</Text>
                </View>
            )}
            <FlatList
                style={styles.list}
                contentContainerStyle={{
                    ...(items.length === 0
                        ? styles.listContentContainerStyle
                        : bottomSpacing
                        ? styles.bottomSpacedListContainer
                        : {}),
                }}
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => <Row {...item} />}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListEmptyComponent={() => <Empty />}
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
            onPress: PropTypes.func,
            height: PropTypes.number,
        }).isRequired
    ).isRequired,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    bottomSpacing: PropTypes.number,
};

List.defaultProps = {
    bottomSpacing: 0,
};
