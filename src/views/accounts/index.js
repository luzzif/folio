import React, { useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EmptyAccounts } from "../../components/accounts/empty";
import { List } from "../../components/list";
import { View, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import makeBlockie from "ethereum-blockies-base64";
import { getShortenedEthereumAddress } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { removeAccount } from "../../actions/accounts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Fab } from "../../components/fab";

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
            bottom: 16,
            right: 16,
        },
        iconsContainer: {
            flexDirection: "row",
        },
        rightSpacer: {
            marginRight: 12,
        },
    });

    const handleAddAccountPress = useCallback(() => {
        navigation.navigate("Account");
    }, [navigation]);

    const getAccountRemoveHandler = (account) => () => {
        dispatch(removeAccount(account));
    };

    const getAccountEditHandler = (account) => () => {
        navigation.navigate("Account", account);
    };

    return (
        <View style={styles.root}>
            {accounts && accounts.length > 0 ? (
                <>
                    <List
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
                                            size={16}
                                            color={theme.text}
                                            icon={faEdit}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={getAccountRemoveHandler(
                                            account
                                        )}
                                    >
                                        <FontAwesomeIcon
                                            size={16}
                                            color={theme.error}
                                            icon={faTrash}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ),
                        }))}
                    />
                    <View style={styles.newAccountButtonContainer}>
                        <Fab
                            title="Add account"
                            faIcon={faPlus}
                            onPress={handleAddAccountPress}
                        />
                    </View>
                </>
            ) : (
                <EmptyAccounts onAddAccountPress={handleAddAccountPress} />
            )}
        </View>
    );
};
