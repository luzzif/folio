import React, { useCallback, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faTrash,
    faPlus,
    faEdit,
    faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { removeManualTransaction } from "../../actions/manual-transaction";
import { formatDecimal } from "../../utils";
import Decimal from "decimal.js";

export const ManualTransactions = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { manualTransactions } = useSelector((state) => ({
        manualTransactions: state.manualTransactions,
    }));

    const commonIconContainerStyles = {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    };

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 12,
        },
        rightSpacer: {
            marginRight: 16,
        },
        modalRoot: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        modalText: {
            color: theme.text,
            fontFamily: "Nunito-Regular",
            marginBottom: 24,
        },
        modalButtonsContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
        },
        successIconContainer: {
            ...commonIconContainerStyles,
            backgroundColor: theme.success,
        },
        errorIconContainer: {
            ...commonIconContainerStyles,
            backgroundColor: theme.error,
        },
    });

    const [
        filteredManualTransactions,
        setFilteredManualTransactions,
    ] = useState([]);
    const [toBeDeletedTransaction, setToBeDeletedTransaction] = useState(null);

    useEffect(() => {
        if (ManualTransactions) {
            setFilteredManualTransactions(
                manualTransactions.filter(
                    (transaction) =>
                        transaction.symbol.toLowerCase() ===
                        route.params.symbol.toLowerCase()
                )
            );
        }
    }, [manualTransactions, route]);

    const handleModalClose = useCallback(() => {
        setToBeDeletedTransaction(null);
    }, []);

    const handleTransactionRemoval = useCallback(() => {
        dispatch(removeManualTransaction(toBeDeletedTransaction));
        handleModalClose();
    }, [dispatch, handleModalClose, toBeDeletedTransaction]);

    const getTransactionRemoveHandler = (transaction) => () => {
        setToBeDeletedTransaction(transaction);
    };

    const getTransactionEditHandler = (transaction) => () => {
        navigation.navigate("Manual transaction", transaction);
    };

    return (
        <View style={styles.root}>
            <List
                header={`Registered transactions (${route.params.symbol})`}
                items={filteredManualTransactions.map((transaction) => ({
                    key: transaction.timestamp,
                    primary: transaction.buy ? "Buy" : "Sell",
                    secondary: formatDecimal(new Decimal(transaction.balance)),
                    icon: (
                        <View
                            style={
                                transaction.buy
                                    ? styles.successIconContainer
                                    : styles.errorIconContainer
                            }
                        >
                            <FontAwesomeIcon
                                icon={transaction.buy ? faPlus : faMinus}
                                style={styles.icon}
                                color={theme.background}
                                size={20}
                            />
                        </View>
                    ),
                    actions: [
                        <TouchableOpacity
                            onPress={getTransactionEditHandler(transaction)}
                        >
                            <FontAwesomeIcon
                                size={20}
                                color={theme.text}
                                icon={faEdit}
                            />
                        </TouchableOpacity>,
                        <TouchableOpacity
                            onPress={getTransactionRemoveHandler(transaction)}
                        >
                            <FontAwesomeIcon
                                size={20}
                                color={theme.error}
                                icon={faTrash}
                            />
                        </TouchableOpacity>,
                    ],
                }))}
            />
            <Modal
                title="Delete transaction"
                open={!!toBeDeletedTransaction}
                onClose={handleModalClose}
            >
                <View style={styles.modalRoot}>
                    <Text style={styles.modalText}>
                        Are you sure you want to delete the transaction?
                    </Text>
                    <View style={styles.modalButtonsContainer}>
                        <View style={styles.rightSpacer}>
                            <Button
                                secondary
                                title="Cancel"
                                onPress={handleModalClose}
                            />
                        </View>
                        <Button
                            title="Delete"
                            onPress={handleTransactionRemoval}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
