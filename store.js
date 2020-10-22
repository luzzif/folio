import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { reducers } from "./src/reducers";

const persistedReducer = persistReducer(
    {
        key: "root",
        storage: AsyncStorage,
        blacklist: ["portfolio", "coinGecko"],
    },
    reducers
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);
