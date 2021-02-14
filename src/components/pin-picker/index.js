import React, { useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { createPin, verifyPin, disablePin } from "../../actions/pin";
import { sha256 } from "../../utils";
import { useTheme } from "@react-navigation/native";
import { ActionButton } from "./action-button";
import { PinDisplayer } from "./pin-displayer";
import LockWhiteIcon from "../../../assets/svg/lock-white.svg";
import LockBlackIcon from "../../../assets/svg/lock-black.svg";

const commonTextStyles = {
    fontFamily: "Poppins",
};

export const PinPicker = ({ status, maximumLength, onCapture }) => {
    const { colors: theme } = useTheme();

    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const styles = StyleSheet.create({
        root: {
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: 25,
            backgroundColor: theme.background,
        },
        header: {
            alignItems: "center",
        },
        title: {
            ...commonTextStyles,
            marginTop: 10,
            fontSize: 18,
            textAlign: "center",
            color: theme.text,
        },
        numberContainer: {
            margin: 23,
        },
        abortButton: {
            color: "red",
        },
        confirmButton: {
            color: "green",
        },
        numberButton: {
            ...commonTextStyles,
            fontSize: 18,
            padding: 16,
            color: theme.text,
            borderRadius: 15,
        },
        pinContainer: {
            alignItems: "center",
        },
        pinNumbersContainer: {
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
        },
    });

    const { existingPin } = useSelector((state) => ({
        existingPin: state.pinConfig.pin,
    }));

    const dispatch = useDispatch();
    const [pin, setPin] = useState("");

    const getTitle = () => {
        switch (status) {
            case "capture": {
                return "Choose a pin";
            }
            case "disable": {
                return "Confirm to disable";
            }
            case "verify": {
                return "Verify the pin";
            }
        }
    };

    const handlePinNumberPress = (number) => {
        if (pin.length < maximumLength) {
            setPin(pin.concat(number));
        }
    };

    const isPinMatching = () => {
        return sha256(pin) === existingPin;
    };

    const handlePinConfirmation = () => {
        switch (status) {
            case "verify": {
                if (isPinMatching()) {
                    dispatch(verifyPin(true));

                    ToastAndroid.show("App unlocked", ToastAndroid.SHORT);

                    break;
                }

                setPin("");

                ToastAndroid.show("Incorrect pin", ToastAndroid.SHORT);
                break;
            }
            case "capture": {
                dispatch(createPin(pin));

                ToastAndroid.show(
                    "Pin succesfully enabled",
                    ToastAndroid.SHORT
                );

                onCapture();
                break;
            }
            case "disable": {
                if (isPinMatching()) {
                    dispatch(disablePin(pin));

                    ToastAndroid.show(
                        "Pin succesfully disabled",
                        ToastAndroid.SHORT
                    );

                    onCapture();
                    break;
                }

                ToastAndroid.show("Incorrect pin", ToastAndroid.SHORT);
                break;
            }
        }
    };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                {darkMode ? <LockWhiteIcon /> : <LockBlackIcon />}
                <Text style={styles.title}>{getTitle()}</Text>
            </View>
            <View style={styles.pinContainer}>
                <PinDisplayer
                    length={pin.length}
                    maximumLength={maximumLength}
                />
                <View style={styles.pinNumbersContainer}>
                    <>
                        {Array.from({ length: 9 }, (_, number) => (
                            <View key={number} style={styles.numberContainer}>
                                <Text
                                    style={styles.numberButton}
                                    onPress={() =>
                                        handlePinNumberPress(number + 1)
                                    }
                                >
                                    {number + 1}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.numberContainer}>
                            <ActionButton
                                role={"delete"}
                                onPress={() => setPin(pin.slice(0, -1))}
                            />
                        </View>
                        <View style={styles.numberContainer}>
                            <Text
                                style={styles.numberButton}
                                onPress={() => handlePinNumberPress(0)}
                            >
                                0
                            </Text>
                        </View>
                        <View style={styles.numberContainer}>
                            <ActionButton
                                role={"confirm"}
                                onPress={handlePinConfirmation}
                            />
                        </View>
                    </>
                </View>
            </View>
        </View>
    );
};

PinPicker.propTypes = {
    onCapture: PropTypes.func,
    status: PropTypes.oneOf(["capture", "verify", "disable", "enable"]),
    maximumLength: PropTypes.number.isRequired,
};

PinPicker.defaultProps = {
    maximumLength: 5,
};
