import React from "react";
import PropTypes from "prop-types";
import { TabBar } from "./tab-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export const BottomSwitcher = ({ items }) => {
    return (
        <>
            <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
                {items.map((item) => (
                    <Tab.Screen
                        key={item.key}
                        name={item.key}
                        options={{ title: item.title, faIcon: item.faIcon }}
                        component={item.component}
                    />
                ))}
            </Tab.Navigator>
        </>
    );
};

BottomSwitcher.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            faIcon: PropTypes.object,
        }).isRequired
    ).isRequired,
};
