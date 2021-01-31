import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { removeManualTransaction } from "../../actions/manual-transaction";
import { formatDecimal } from "../../utils";
import Decimal from "decimal.js";
import { AppTitle } from "../../components/app-title";
import PlusIcon from "../../../assets/svg/plus.svg";
import EditWhiteIcon from "../../../assets/svg/edit-white.svg";
import EditBlackIcon from "../../../assets/svg/edit-black.svg";
import DeleteWhiteIcon from "../../../assets/svg/delete-white.svg";
import DeleteBlackIcon from "../../../assets/svg/delete-black.svg";

export const ManualTransactions = ({ navigation, route }) => {
    const { dark, colors: theme } = useTheme();
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
            fontFamily: "Poppins-Regular",
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

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    return (
        <View style={styles.root}>
            <AppTitle
                title={`Manual txs (${route.params.symbol.toUpperCase()})`}
                closeable
                onClose={handleClose}
            />
            <List
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
                            <PlusIcon width={16} height={16} />
                        </View>
                    ),
                    actions: [
                        <TouchableOpacity
                            onPress={getTransactionEditHandler(transaction)}
                        >
                            {dark ? (
                                <EditWhiteIcon width={20} height={20} />
                            ) : (
                                <EditBlackIcon width={20} height={20} />
                            )}
                        </TouchableOpacity>,
                        <TouchableOpacity
                            onPress={getTransactionRemoveHandler(transaction)}
                        >
                            {dark ? (
                                <DeleteWhiteIcon width={20} height={20} />
                            ) : (
                                <DeleteBlackIcon width={20} height={20} />
                            )}
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
