import React from "react";
import ReactNativeModal from "react-native-modal";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import CloseBlackIcon from "../../../assets/svg/close-black.svg";
import CloseWhiteIcon from "../../../assets/svg/close-white.svg";

export const Modal = ({ title, open, onClose, children }) => {
    const { dark, colors: theme } = useTheme();

    const styles = StyleSheet.create({
        modal: {
            position: "absolute",
            bottom: 0,
            width: "100%",
            margin: 0,
        },
        root: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        header: {
            paddingTop: 20,
            paddingHorizontal: 24,
            paddingBottom: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            color: theme.text,
            fontFamily: "Poppins-Bold",
            fontSize: 20,
            letterSpacing: 1,
        },
    });

    return (
        <ReactNativeModal
            isVisible={open}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            backdropColor={theme.shadow}
            backdropTransitionOutTiming={0}
            animationInTiming={300}
            animationOutTiming={300}
            style={styles.modal}
        >
            <View style={styles.root}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {dark ? (
                        <CloseWhiteIcon
                            width={20}
                            height={20}
                            onPress={onClose}
                        />
                    ) : (
                        <CloseBlackIcon
                            width={20}
                            height={20}
                            onPress={onClose}
                        />
                    )}
                </View>
                {children}
            </View>
        </ReactNativeModal>
    );
};
