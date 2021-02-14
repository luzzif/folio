import React, {  useState } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@react-navigation/native";
import { PinPicker } from "../../components/pin-picker";

export const PinLock = ({ navigation, route }) => {
    const { colors: theme } = useTheme();

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            height: "100%",
            backgroundColor: theme.background,
        },
        pieChart: {
            width: 200,
            height: 200,
        },
        pieChartContainer: {
            width: "100%",
            alignItems: "center",
            marginBottom: 32,
        },
    });

    const [action] = useState(route.params.action);

    return (
        <View style={styles.root}>
            <PinPicker status={action} onCapture={() => navigation.pop()} />
        </View>
    );
};

PinLock.propTypes = {};
