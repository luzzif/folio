import React from "react";
import PropTypes from "prop-types";
import Svg, { Circle, Text } from "react-native-svg";
import { cryptoIcons } from "../../../assets/svg/crypto-icons";
import { useTheme } from "@react-navigation/native";

export const CryptoIcon = ({ icon, size }) => {
    const { colors: theme } = useTheme();

    const lowerCaseIcon = icon.toLowerCase();
    if (lowerCaseIcon in cryptoIcons) {
        const { default: Icon } = cryptoIcons[lowerCaseIcon];
        return <Icon width={size} height={size} />;
    }

    return (
        <Svg height={size} width={size}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2}
                fill={theme.text}
            />
            <Text
                fill={theme.textInverted}
                stroke="none"
                fontSize="10"
                fontWeight="700"
                x={size / 2}
                y={size / 2 + 4}
                textAnchor="middle"
            >
                {icon.toUpperCase().length > 3
                    ? `${icon.toUpperCase().slice(0, 3)}...`
                    : icon.toUpperCase()}
            </Text>
        </Svg>
    );
};

CryptoIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
