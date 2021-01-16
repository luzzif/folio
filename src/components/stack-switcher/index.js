import React from "react";
import PropTypes from "prop-types";
import { createStackNavigator } from "@react-navigation/stack";

import { Header } from "./header";

const Stack = createStackNavigator();

export const StackSwitcher = ({ items }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                header: (props) => <Header {...props} />,
                transitionSpec: {
                    open: {
                        animation: "timing",
                        config: {
                            duration: 300,
                        },
                    },
                    close: {
                        animation: "timing",
                        config: {
                            duration: 300,
                        },
                    },
                },
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
