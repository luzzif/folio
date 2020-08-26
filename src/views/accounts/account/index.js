import React, { useContext, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../contexts/theme";
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

export const Account = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
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
            padding: 16,
        },
        bottomSpacedContainer: {
            marginBottom: 24,
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

    const getFieldUpdateHandler = (field) => (newValue) => {
        let validValue = true;
        if (!newValue && field.required) {
            validValue = false;
        } else if (typeof field.validate === "function") {
            validValue === field.validate(newValue, accounts, !!updatingId);
        } else {
            validValue = true;
        }
        setFields({
            ...fields,
            [field.name]: { value: newValue, valid: validValue },
        });
    };

    const getFieldComponent = (field) => {
        switch (field.type) {
            case SPECIFICATION_FIELD_TYPE.INPUT: {
                return (
                    <Input
                        label={field.label}
                        value={fields[field.name].value}
                        onChangeText={getFieldUpdateHandler(field)}
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

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <View style={styles.bottomSpacedContainer}>
                    <Input label="Name" value={name} onChangeText={setName} />
                </View>
                {specification.fields.map((field) => (
                    <View key={field.name} style={styles.bottomSpacedContainer}>
                        {getFieldComponent(field)}
                    </View>
                ))}
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
