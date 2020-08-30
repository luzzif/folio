import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const Header = ({ scene, navigation }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            backgroundColor: theme.background,
        },
        content: {
            flexDirection: "row",
            justifyContent: "center",
            height: 56,
            alignItems: "center",
            width: "100%",
            backgroundColor: theme.foreground,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            elevation: 4,
        },
        locationText: {
            fontFamily: "Montserrat-SemiBold",
            fontSize: 16,
            color: theme.text,
        },
        closeIconContainer: {
            position: "absolute",
            right: 16,
            top: 18,
        },
    });

    const [location, setLocation] = useState("");

    useEffect(() => {
        const { options } = scene.descriptor;
        setLocation(
            options.headerTitle
                ? options.headerTitle
                : options.title
                ? options.title
                : scene.route.name
        );
    }, [scene]);

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <Text style={styles.locationText}>{location}</Text>
                {scene.descriptor.options.allowClose && (
                    <TouchableOpacity
                        style={styles.closeIconContainer}
                        onPress={navigation.goBack}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            size={20}
                            color={theme.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
