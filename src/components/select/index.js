import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "../input";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Modal } from "../modal";
import { List } from "../list";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export const Select = ({ value, options, onChange, label }) => {
    const styles = StyleSheet.create({
        optionsListContainer: {
            height: 240,
        },
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (value) {
            const selectedOption = options.find((option) => option === value);
            if (selectedOption) {
                setInputValue(selectedOption.label || selectedOption.value);
            }
        }
    }, [options, value]);

    const handleInputPress = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    const getOptionPressHandler = (newValue) => () => {
        onChange(newValue);
        setModalOpen(false);
    };

    return (
        <>
            <TouchableOpacity onPress={handleInputPress}>
                <Input
                    disabled
                    label={label}
                    value={inputValue}
                    faIcon={faCaretDown}
                />
            </TouchableOpacity>
            <Modal
                title="Pick an option"
                open={!!modalOpen}
                onClose={handleModalClose}
            >
                <View style={styles.optionsListContainer}>
                    <List
                        items={options.map((option) => ({
                            ...option.listItemSpecification,
                            onPress: getOptionPressHandler(option),
                        }))}
                    />
                </View>
            </Modal>
        </>
    );
};

Select.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            listItemSpecification: PropTypes.shape({
                icon: PropTypes.node,
                primary: PropTypes.string,
                secondary: PropTypes.string,
                tertiary: PropTypes.string,
                quaternary: PropTypes.string,
            }).isRequired,
        })
    ),
    onChange: PropTypes.func.isRequired,
};
