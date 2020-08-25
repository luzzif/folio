import React, { useCallback, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EmptyAccounts } from "../../components/accounts/empty";
import { List } from "../../components/list";
import { View, StyleSheet, Image, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import makeBlockie from "ethereum-blockies-base64";
import { getShortenedEthereumAddress } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { removeAccount } from "../../actions/accounts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Fab } from "../../components/fab";
import Modal from "react-native-modal";
import { Button } from "../../components/button";

export const Accounts = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => ({ accounts: state.accounts }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 16,
        },
        blockie: {
            width: 36,
            height: 36,
            borderRadius: 36,
        },
        newAccountButtonContainer: {
            position: "absolute",
            bottom: 24,
            right: 24,
        },
        iconsContainer: {
            flexDirection: "row",
        },
        rightSpacer: {
            marginRight: 16,
        },
        confirmationModalRoot: {
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 20,
        },
        confirmationModalText: {
            color: theme.text,
            textAlign: "center",
            textAlignVertical: "center",
            fontFamily: "Montserrat-Medium",
            marginBottom: 24,
        },
        confirmationModalButtonsContainer: {
            flexDirection: "row",
            justifyContent: "center",
        },
    });

    const [toBeDeletedAccount, setToBeDeletedAccount] = useState(null);

    const handleAddAccountPress = useCallback(() => {
        navigation.navigate("Account");
    }, [navigation]);

    const handleConfirmationModalClose = useCallback(() => {
        setToBeDeletedAccount(null);
    }, []);

    const handleAccountRemoval = useCallback(() => {
        dispatch(removeAccount(toBeDeletedAccount));
        setToBeDeletedAccount(null);
    }, [dispatch, toBeDeletedAccount]);

    const getAccountRemoveHandler = (account) => () => {
        setToBeDeletedAccount(account);
    };

    const getAccountEditHandler = (account) => () => {
        navigation.navigate("Account", account);
    };

    return (
        <View style={styles.root}>
            {accounts && accounts.length > 0 ? (
                <List
                    header="Accounts"
                    items={accounts.map((account) => ({
                        key: account.address,
                        primary:
                            account.name ||
                            getShortenedEthereumAddress(account.address),
                        icon: (
                            <Image
                                source={{
                                    uri: makeBlockie(account.address),
                                }}
                                style={styles.blockie}
                            />
                        ),
                        tertiary: (
                            <View style={styles.iconsContainer}>
                                <TouchableOpacity
                                    style={styles.rightSpacer}
                                    onPress={getAccountEditHandler(account)}
                                >
                                    <FontAwesomeIcon
                                        size={20}
                                        color={theme.text}
                                        icon={faEdit}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={getAccountRemoveHandler(account)}
                                >
                                    <FontAwesomeIcon
                                        size={20}
                                        color={theme.error}
                                        icon={faTrash}
                                    />
                                </TouchableOpacity>
                            </View>
                        ),
                    }))}
                />
            ) : (
                <EmptyAccounts onAddAccountPress={handleAddAccountPress} />
            )}
            <View style={styles.newAccountButtonContainer}>
                <Fab
                    title="Add account"
                    faIcon={faPlus}
                    onPress={handleAddAccountPress}
                />
            </View>
            <Modal
                isVisible={!!toBeDeletedAccount}
                onBackdropPress={handleConfirmationModalClose}
                onBackButtonPress={handleConfirmationModalClose}
                backdropColor={theme.shadow}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
            >
                <View style={styles.confirmationModalRoot}>
                    <Text style={styles.confirmationModalText}>
                        Are you sure you want to delete the account?
                    </Text>
                    <View style={styles.confirmationModalButtonsContainer}>
                        <View style={styles.rightSpacer}>
                            <Button
                                secondary
                                title="Cancel"
                                onPress={handleConfirmationModalClose}
                            />
                        </View>
                        <Button title="Delete" onPress={handleAccountRemoval} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
