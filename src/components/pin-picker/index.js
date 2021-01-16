import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { createPin, verifyPin, disablePin } from "../../actions/pin";
import { sha256 } from "../../utils"
import { ThemeContext } from "../../contexts/theme";
import { Button } from "../button";
import { ActionButton } from "./action-button";
import { PinDisplayer } from "./pin-displayer";

export const PinPicker = ({
    status,
    maximumLength,
    onCapture,
}) => {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        root: {
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: 25,
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 24,
            textAlign: "center",
            color: theme.text,
        },
        numberContainer: {
            margin: 23,
        },
        abortButton: {
            color: "red"
        },
        confirmButton: {
            color: "green"
        },
        numberButton: {
            borderRadius: 15,
        },
        pickerContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
        }
    });

    const { existingPin } = useSelector((state) => ({
        existingPin: state.pinConfig.pin,
    }));

    const dispatch = useDispatch();
    const [pin, setPin] = useState("");

    const getTitle = () => {
        switch (status) {
            case "capture": {
                return "Create the passcode";
            }
            case "disable": {
                return "Confirm to disable";
            }
            case "verify": {
                return "Verify the passcode";
            }

        }
    }

    const handlePinNumberPress = (number) => {
        if (pin.length < maximumLength) {
            setPin(pin.concat(number));
        }
    }

    const isPinMatching = () => {
        return sha256(pin) === existingPin;
    }

    const handlePinConfirmation = () => {
        switch (status) {
            case "verify": {
                if (isPinMatching()) {
                    dispatch(verifyPin(true));

                    ToastAndroid.show(
                        "App unlocked",
                        ToastAndroid.SHORT
                    );

                    break;
                }

                ToastAndroid.show(
                    "Incorrect pin",
                    ToastAndroid.SHORT
                );
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

                ToastAndroid.show(
                    "Incorrect pin",
                    ToastAndroid.SHORT
                );

                break;
            }
        }
    }

    return (
        <View style={styles.root}>
            <FontAwesomeIcon
                size={24}
                icon={faLock}
                color={theme.text}
                style={styles.dot}
            />
            <Text style={styles.title}>{getTitle()}</Text>
            <View style={styles.pickerContainer}>
                <>
                    {Array.from({ length: 9 }, (_, number) => (
                        <View key={number} style={styles.numberContainer}>
                            <Button style={styles.numberButton} secondary={true} title={number + 1} onPress={() => handlePinNumberPress(number + 1)} />
                        </View>
                    ))}
                    <View style={styles.numberContainer}>
                        <ActionButton role={"confirm"} onPress={handlePinConfirmation} />
                    </View>
                    <View style={styles.numberContainer}>
                        <Button style={styles.numberButton} secondary={true} title={0} onPress={() => handlePinNumberPress(0)} />
                    </View>
                    <View style={styles.numberContainer}>
                        <ActionButton role={"delete"} onPress={() => setPin(pin.slice(0, -1))} />
                    </View>
                </>
            </View>
            <PinDisplayer
                length={pin.length}
                maximumLength={maximumLength}
            />
        </View>
    );
};

PinPicker.propTypes = {
    onCapture: PropTypes.func,
    status: PropTypes.oneOf([
        "capture",
        "verify",
        "disable",
        "enable"
    ]),
    maximumLength: PropTypes.number.isRequired
};

PinPicker.defaultProps = {
    maximumLength: 5
}
