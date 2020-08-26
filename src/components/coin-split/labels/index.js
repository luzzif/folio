import React from "react";
import { Text } from "react-native-svg";

export const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
        const { pieCentroid, data } = slice;
        return (
            <Text
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill={"white"}
                textAnchor={"middle"}
                alignmentBaseline={"middle"}
                fontSize={24}
                stroke={"black"}
                strokeWidth={0.2}
            >
                {data.symbol}
            </Text>
        );
    });
};
