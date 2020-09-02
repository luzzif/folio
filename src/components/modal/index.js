import React, { useContext } from "react";
import ReactNativeModal from "react-native-modal";
import { ThemeContext } from "../../contexts/theme";
import { StyleSheet, Text, View } from "react-native";

export const Modal = ({ title, open, onClose, children }) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            backgroundColor: theme.background,
            borderRadius: 12,
        },
        title: {
            color: theme.text,
            fontFamily: "Nunito-Bold",
            paddingHorizontal: 24,
            paddingVertical: 16,
            fontSize: 16,
        },
    });

    return (
        <ReactNativeModal
            isVisible={open}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            backdropColor={theme.shadow}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropTransitionOutTiming={0}
            animationInTiming={300}
            animationOutTiming={300}
        >
            <View style={styles.root}>
                {title && <Text style={styles.title}>{title}</Text>}
                {children}
            </View>
        </ReactNativeModal>
    );
};
