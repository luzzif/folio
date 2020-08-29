import React, { useCallback, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet, Image, Text } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { getShortenedEthereumAddress } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { removeAccount } from "../../actions/accounts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Fab } from "../../components/fab";
import { Button } from "../../components/button";
import { PORTFOLIO_SOURCE, PORTFOLIO_SOURCE_ICON } from "../../commons";
import { Modal } from "../../components/modal";

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
        icon: {
            width: 36,
            height: 36,
            borderRadius: 36,
        },
        newAccountButtonContainer: {
            position: "absolute",
            bottom: 24,
            right: 24,
        },
        rightSpacer: {
            marginRight: 16,
        },
        modalRoot: {
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        modalText: {
            color: theme.text,
            textAlign: "center",
            textAlignVertical: "center",
            fontFamily: "Montserrat-Medium",
            marginBottom: 24,
        },
        accountTypeListContainer: {
            height: 240,
        },
        modalButtonsContainer: {
            flexDirection: "row",
            justifyContent: "center",
        },
    });

    const [toBeDeletedAccount, setToBeDeletedAccount] = useState(null);
    const [addingAccount, setAddingAccount] = useState(false);

    const handleAddAccountPress = useCallback(() => {
        setAddingAccount(true);
    }, []);

    const getAccountTypeSelectionPressHandler = (type) => (source) => {
        navigation.navigate("Account", { type });
        handleModalClose();
    };

    const handleModalClose = useCallback(() => {
        setToBeDeletedAccount(null);
        setAddingAccount(false);
    }, []);

    const handleAccountRemoval = useCallback(() => {
        dispatch(removeAccount(toBeDeletedAccount));
        handleModalClose();
    }, [dispatch, handleModalClose, toBeDeletedAccount]);

    const getAccountRemoveHandler = (account) => () => {
        setToBeDeletedAccount(account);
    };

    const getAccountEditHandler = (account) => () => {
        navigation.navigate("Account", account);
    };

    return (
        <View style={styles.root}>
            <List
                header="Your accounts"
                items={accounts.map((account) => ({
                    key: account.id,
                    primary:
                        account.name ||
                        getShortenedEthereumAddress(account.address),
                    icon: (
                        <Image
                            source={PORTFOLIO_SOURCE_ICON[account.type]}
                            style={styles.icon}
                        />
                    ),
                    actions: [
                        <TouchableOpacity
                            onPress={getAccountEditHandler(account)}
                        >
                            <FontAwesomeIcon
                                size={20}
                                color={theme.text}
                                icon={faEdit}
                            />
                        </TouchableOpacity>,
                        <TouchableOpacity
                            onPress={getAccountRemoveHandler(account)}
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
            <View style={styles.newAccountButtonContainer}>
                <Fab faIcon={faPlus} onPress={handleAddAccountPress} />
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
            <Modal
                title="Pick an option"
                open={!!addingAccount}
                onClose={handleModalClose}
            >
                <View style={styles.accountTypeListContainer}>
                    <List
                        items={Object.values(PORTFOLIO_SOURCE)
                            .sort()
                            .map((source) => ({
                                icon: (
                                    <Image
                                        source={PORTFOLIO_SOURCE_ICON[source]}
                                        style={styles.icon}
                                    />
                                ),
                                key: source,
                                primary: source,
                                onPress: getAccountTypeSelectionPressHandler(
                                    source
                                ),
                            }))}
                    />
                </View>
            </Modal>
        </View>
    );
};
