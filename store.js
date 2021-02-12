import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { reducers } from "./src/reducers";

const rootPersistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: ["coinGecko", "existingPin"],
};

const pinLockPersistConfig = {
    key: "existingPin",
    storage: AsyncStorage,
    blacklist: ["isVerified", "isVerifying"],
};

const rootReducer = combineReducers({
    ...reducers,
    pinConfig: persistReducer(pinLockPersistConfig, reducers.pinConfig),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);
