import React, { useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List } from "../../components/list";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/theme";
import { Switch } from "../../components/switch";
import { toggleDarkMode } from "../../actions/settings";
import { version } from "../../../package.json";

export const Settings = () => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => ({
        darkMode: state.settings.darkMode,
    }));

    const styles = StyleSheet.create({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
            paddingTop: 16,
        },
    });

    const handleDarkModeToggle = useCallback(() => {
        dispatch(toggleDarkMode());
    }, [dispatch]);

    return (
        <View style={styles.root}>
            <List
                items={[
                    {
                        key: "darkMode",
                        primary: "Dark mode",
                        tertiary: (
                            <Switch
                                value={darkMode}
                                onChange={handleDarkModeToggle}
                            />
                        ),
                    },
                    {
                        key: "version",
                        primary: "Version",
                        tertiary: version,
                    },
                ]}
            />
        </View>
    );
};
