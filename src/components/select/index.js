import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "../input";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Modal } from "../modal";
import { List } from "../list";

export const Select = ({
    small,
    hidden,
    naked,
    value,
    options,
    onChange,
    label,
    searchable,
    open,
    onClose,
}) => {
    const styles = StyleSheet.create({
        searchbarContainer: {
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        optionsListContainer: {
            height: 240,
        },
    });

    const [modalOpen, setModalOpen] = useState(!!open);
    const [inputValue, setInputValue] = useState("");
    const [orderedOptions, setOrderedOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(
                (option) => option === value || option.value === value
            );
            if (selectedOption) {
                setInputValue(selectedOption.label || selectedOption.value);
            }
        }
    }, [options, value]);

    useEffect(() => {
        if (options) {
            setOrderedOptions(
                options.sort((a, b) => {
                    const firstLabel = a.label.toLowerCase();
                    const secondLabel = b.label.toLowerCase();
                    if (firstLabel < secondLabel) {
                        return -1;
                    }
                    if (firstLabel > secondLabel) {
                        return 1;
                    }
                    return 0;
                })
            );
        } else {
            setOrderedOptions([]);
        }
    }, [options, searchQuery]);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
            setFilteredOptions(
                orderedOptions.filter((option) =>
                    option.label.toLowerCase().includes(lowerCaseSearchQuery)
                )
            );
        } else {
            setFilteredOptions(orderedOptions);
        }
    }, [orderedOptions, searchQuery]);

    const handleInputPress = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        if (onClose) {
            onClose();
            return;
        }
        setModalOpen(false);
        setTimeout(() => {
            // wait for the modal to close in order to avoid unpleasant ui effect
            setSearchQuery("");
        }, 500);
    }, [onClose]);

    const getOptionPressHandler = (newValue) => () => {
        onChange(newValue);
        handleModalClose();
    };

    return (
        <>
            {!hidden && (
                <TouchableOpacity onPress={handleInputPress}>
                    <Input
                        small={small}
                        naked={naked}
                        disabled
                        label={label}
                        value={inputValue}
                    />
                </TouchableOpacity>
            )}
            <Modal
                title="Pick an option"
                open={open || modalOpen}
                onClose={handleModalClose}
            >
                {searchable && (
                    <View style={styles.searchbarContainer}>
                        <Input
                            placeholder="Search..."
                            onChangeText={setSearchQuery}
                        />
                    </View>
                )}
                <View style={styles.optionsListContainer}>
                    <List
                        items={filteredOptions.map((option) => ({
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
