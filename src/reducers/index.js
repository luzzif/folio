import { combineReducers } from "redux";
import { portfolioReducer } from "./portfolio";
import { accountsReducer } from "./accounts";
import { settingsReducer } from "./settings";
import { coinGeckoReducer } from "./coingecko";

export const reducers = combineReducers({
    portfolio: portfolioReducer,
    accounts: accountsReducer,
    settings: settingsReducer,
    coinGecko: coinGeckoReducer,
});
