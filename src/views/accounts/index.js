import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { removeAccount } from "../../actions/accounts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { AppTitle } from "../../components/app-title";
import { CryptoIcon } from "../../components/crypto-icon";
import DeleteBlackIcon from "../../../assets/svg/delete-black.svg";
import DeleteWhiteIcon from "../../../assets/svg/delete-white.svg";
import EditBlackIcon from "../../../assets/svg/edit-black.svg";
import EditWhiteIcon from "../../../assets/svg/edit-white.svg";

export const Accounts = ({ navigation }) => {
    const { dark, colors: theme } = useTheme();
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => ({ accounts: state.accounts }));

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
            textAlignVertical: "center",
            fontFamily: "Poppins-Regular",
            marginBottom: 24,
        },
        accountTypeListContainer: {
            height: 240,
        },
        modalButtonsContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
        },
    });

    const [toBeDeletedAccount, setToBeDeletedAccount] = useState(null);

    const handleModalClose = useCallback(() => {
        setToBeDeletedAccount(null);
    }, []);

    const handleAccountRemoval = useCallback(
        (event) => {
            dispatch(removeAccount(toBeDeletedAccount));
            handleModalClose();
        },
        [dispatch, handleModalClose, toBeDeletedAccount]
    );

    const getAccountRemoveHandler = (account) => () => {
        setToBeDeletedAccount(account);
    };

    const getAccountEditHandler = (account) => () => {
        navigation.navigate("Account", account);
    };

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    return (
        <>
            <View style={styles.root}>
                <AppTitle title="Accounts" closeable onClose={handleClose} />
                <List
                    items={accounts.map((account) => ({
                        key: account.id,
                        primary: account.name || "Unnamed account",
                        icon: <CryptoIcon icon={account.type} size={36} />,
                        actions: [
                            <TouchableOpacity
                                onPress={getAccountEditHandler(account)}
                            >
                                {dark ? (
                                    <DeleteWhiteIcon width={20} height={20} />
                                ) : (
                                    <DeleteBlackIcon width={20} height={20} />
                                )}
                            </TouchableOpacity>,
                            <TouchableOpacity
                                onPress={getAccountRemoveHandler(account)}
                            >
                                {dark ? (
                                    <EditWhiteIcon width={20} height={20} />
                                ) : (
                                    <EditBlackIcon width={20} height={20} />
                                )}
                            </TouchableOpacity>,
                        ],
                    }))}
                />
            </View>
            <Modal
                title="Delete account"
                open={!!toBeDeletedAccount}
                onClose={handleModalClose}
            >
                <View style={styles.modalRoot}>
                    <Text style={styles.modalText}>
                        Are you sure you want to delete the account?
                    </Text>
                    <View style={styles.modalButtonsContainer}>
                        <View style={styles.rightSpacer}>
                            <Button
                                secondary
                                title="Cancel"
                                onPress={handleModalClose}
                            />
                        </View>
                        <Button title="Delete" onPress={handleAccountRemoval} />
                    </View>
                </View>
            </Modal>
        </>
    );
};
