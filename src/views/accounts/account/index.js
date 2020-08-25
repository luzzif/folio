import React, { useContext, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import { useDispatch, useSelector } from "react-redux";
import {
    addEthereumWalletAccount,
    updateEthereumWalletAccount,
} from "../../../actions/accounts";
import ethereumRegex from "ethereum-regex";
import PropTypes from "prop-types";

const configuredEthereumRegex = ethereumRegex({ exact: true });

export const Account = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => ({ accounts: state.accounts }));

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        content: {
            padding: 16,
        },
        bottomSpacedContainer: {
            marginBottom: 24,
        },
    });
    const [updating] = useState(route.params && route.params.address);
    const [localAddress, setLocalAddress] = useState(
        (route.params && route.params.address) || ""
    );
    const [localName, setLocalName] = useState(
        (route.params && route.params.name) || ""
    );

    const handleSavePress = useCallback(() => {
        dispatch(
            updating
                ? updateEthereumWalletAccount(localName, localAddress)
                : addEthereumWalletAccount(localName, localAddress)
        );
        navigation.pop();
    }, [dispatch, localAddress, localName, navigation, updating]);

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <View style={styles.bottomSpacedContainer}>
                    <Input
                        label="Name"
                        value={localName}
                        onChangeText={setLocalName}
                    />
                </View>
                <View style={styles.bottomSpacedContainer}>
                    <Input
                        label="Ethereum address"
                        value={localAddress}
                        onChangeText={setLocalAddress}
                        required
                    />
                </View>
                <View style={styles.bottomSpacedContainer}>
                    <Button
                        title="Save"
                        onPress={handleSavePress}
                        disabled={
                            !!(
                                !localAddress ||
                                !configuredEthereumRegex.test(localAddress) ||
                                (!updating &&
                                    accounts.find(
                                        (account) =>
                                            account.address === localAddress
                                    ))
                            )
                        }
                    />
                </View>
            </View>
        </View>
    );
};

Account.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};
