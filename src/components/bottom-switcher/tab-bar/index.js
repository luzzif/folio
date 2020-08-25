import React, { useContext } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const commonItemStyle = {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
};

export const TabBar = ({ state, descriptors, navigation }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            backgroundColor: theme.background,
        },
        content: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: 48,
            borderTopStartRadius: 12,
            borderTopEndRadius: 12,
            backgroundColor: theme.foreground,
            elevation: 12,
        },
        itemTextWrapper: {
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        selectedItemIndicator: {
            position: "absolute",
            height: 1,
            borderRadius: 2,
            backgroundColor: theme.text,
            top: 0,
            width: "40%",
        },
        fullSize: {
            flex: 1,
            alignItems: "center",
        },
        selectedItemText: {
            ...commonItemStyle,
            color: theme.text,
        },
        unselectedItemText: {
            ...commonItemStyle,
            color: theme.text,
        },
        icon: {
            marginBottom: 4,
            color: theme.text,
        },
    });

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.title;
                    const faIcon = options.faIcon;

                    const focused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={focused ? ["selected"] : []}
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            key={label}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.fullSize}
                        >
                            <View style={styles.itemTextWrapper}>
                                {focused && (
                                    <View
                                        style={styles.selectedItemIndicator}
                                    />
                                )}
                                {faIcon && (
                                    <FontAwesomeIcon
                                        icon={faIcon}
                                        style={styles.icon}
                                        size={12}
                                    />
                                )}
                                <Text
                                    style={
                                        focused
                                            ? styles.selectedItemText
                                            : styles.unselectedItemText
                                    }
                                >
                                    {label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

TabBar.propTypes = {
    state: PropTypes.object.isRequired,
    descriptors: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};
