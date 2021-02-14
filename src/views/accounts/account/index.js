import React, { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount, addAccount } from "../../../actions/accounts";
import PropTypes from "prop-types";
import {
    SPECIFICATION_FIELD_TYPE,
    PORTFOLIO_SOURCE,
    PORTFOLIO_SOURCE_SPECIFICATION,
} from "../../../commons";
import { AppTitle } from "../../../components/app-title";

export const Account = ({ navigation, route }) => {
    const { colors: theme } = useTheme();
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => ({
        accounts: state.accounts,
    }));

    const styles = StyleSheet.create({
        root: {
            height: "100%",
            backgroundColor: theme.background,
        },
        content: {
            paddingHorizontal: 16,
        },
        bottomSpacedContainer: {
            marginBottom: 24,
        },
        saveButtonContainer: {
            position: "absolute",
            width: "100%",
            bottom: 16,
            paddingHorizontal: 16,
        },
    });

    const [updatingId] = useState(route.params.id);
    const [accountType] = useState(route.params.type);
    const [name, setName] = useState(route.params.name || "");
    const [specification] = useState(
        PORTFOLIO_SOURCE_SPECIFICATION[route.params.type]
    );
    const [fields, setFields] = useState(
        updatingId
            ? Object.entries(
                  accounts.find((account) => account.id === updatingId).fields
              ).reduce((accumulator, [fieldName, value]) => {
                  accumulator[fieldName] = { value, valid: true };
                  return accumulator;
              }, {})
            : specification.fields.reduce((values, field) => {
                  let value;
                  switch (field.type) {
                      case SPECIFICATION_FIELD_TYPE.INPUT: {
                          value = { value: "", valid: !field.required };
                          break;
                      }
                      default: {
                          throw new Error(
                              `unhandled field type ${field.type} given`
                          );
                      }
                  }
                  values[field.name] = value;
                  return values;
              }, {})
    );
    const [isValidating, setIsValidating] = useState(false);

    const getFieldUpdateHandler = (field) => async (newValue) => {
        setFields({
            ...fields,
            [field.name]: { value: newValue, valid: false },
        });
    };

    const validateField = async (field) => {
        setIsValidating(true);

        let validValue = true;
        if (!fields[field.name].value && field.required) {
            validValue = false;
        } else if (typeof field.validate === "function") {
            validValue = await field.validate(
                fields[field.name].value,
                accounts,
                !!updatingId
            );
        } else {
            validValue = true;
        }

        setFields({
            ...fields,
            [field.name]: {
                value: fields[field.name].value,
                valid: validValue,
            },
        });
    };

    const getFieldComponent = (field) => {
        switch (field.type) {
            case SPECIFICATION_FIELD_TYPE.INPUT: {
                return (
                    <Input
                        placeholder={field.label}
                        value={fields[field.name].value}
                        onChangeText={getFieldUpdateHandler(field)}
                        onBlur={() => validateField(field)}
                        validate={isValidating}
                        valid={fields[field.name].valid}
                        required={field.required}
                    />
                );
            }
            default: {
                throw new Error(`unhandled field type ${field.type} given`);
            }
        }
    };

    const handleSavePress = useCallback(() => {
        const fieldValues = Object.entries(fields).reduce(
            (accumulator, [fieldName, wrappedValue]) => {
                accumulator[fieldName] = wrappedValue.value;
                return accumulator;
            },
            {}
        );
        dispatch(
            updatingId
                ? updateAccount(updatingId, name, accountType, fieldValues)
                : addAccount(name, accountType, fieldValues)
        );
        navigation.pop();
    }, [accountType, dispatch, fields, name, navigation, updatingId]);

    const handleClose = useCallback(() => {
        navigation.pop();
    }, [navigation]);

    return (
        <View style={styles.root}>
            <AppTitle
                title={`Account (${accountType})`}
                closeable
                onClose={handleClose}
            />
            <View style={styles.content}>
                <View style={styles.bottomSpacedContainer}>
                    <Input
                        placeholder="Name"
                        value={name}
                        validate={false}
                        onChangeText={setName}
                    />
                </View>
                {specification.fields.map((field) => (
                    <View key={field.name} style={styles.bottomSpacedContainer}>
                        {getFieldComponent(field)}
                    </View>
                ))}
            </View>
            <View style={styles.saveButtonContainer}>
                <Button
                    title="Save"
                    onPress={handleSavePress}
                    disabled={
                        !Object.values(fields).reduce(
                            (validForm, field) => validForm && field.valid,
                            true
                        )
                    }
                />
            </View>
        </View>
    );
};

Account.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.oneOf(Object.values(PORTFOLIO_SOURCE)).isRequired,
            name: PropTypes.string,
        }),
    }).isRequired,
};
