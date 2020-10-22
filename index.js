import "react-native-gesture-handler";
import React from "react";
import { AppRegistry } from "react-native";
import { App } from "./src/views/app";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./store";

const persistor = persistStore(store);

const Root = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
                <App />
            </NavigationContainer>
        </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
