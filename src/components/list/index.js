import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Row } from "./row";
import { ThemeContext } from "../../contexts/theme";
import { Empty } from "./empty";

export const List = ({
    header,
    items,
    onRefresh,
    refreshing,
    bottomSpacing,
}) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            flex: 1,
        },
        list: {
            paddingHorizontal: 16,
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
        },
        headerText: {
            fontFamily: "Nunito-Bold",
            marginLeft: 8,
            color: theme.text,
        },
        orderingText: {
            fontFamily: "Nunito-Regular",
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
        }).isRequired
    ).isRequired,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    bottomSpacing: PropTypes.number,
};

List.defaultProps = {
    bottomSpacing: 0,
};
