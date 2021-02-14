import React from "react";
import PropTypes from "prop-types";
import {
    createStackNavigator,
    TransitionPresets,
} from "@react-navigation/stack";

const Stack = createStackNavigator();

export const StackSwitcher = ({ items }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            {items.map((item) => (
                <Stack.Screen
                    key={item.name}
                    name={item.name}
                    component={item.component}
                    options={{
                        allowClose: item.allowClose,
                    }}
                />
            ))}
        </Stack.Navigator>
    );
};

StackSwitcher.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            allowClose: PropTypes.bool,
        }).isRequired
    ).isRequired,
};
