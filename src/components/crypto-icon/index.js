import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";

export const CryptoIcon = ({ icon, size, ...rest }) => {
    const styles = {
        icon: {
            borderRadius: size,
            width: size,
            height: size,
        },
    };

    return (
        <Image
            {...rest}
            alt="Icon"
            style={styles.icon}
            source={{
                uri: icon,
            }}
        />
    );
};

CryptoIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
