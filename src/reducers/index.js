import { combineReducers } from "redux";
import { loadingsReducer } from "./loadings";
import { portfolioReducer } from "./portfolio";
import { pricesReducer } from "./prices";
import { accountsReducer } from "./accounts";
import { settingsReducer } from "./settings";

export const reducers = combineReducers({
    loadings: loadingsReducer,
    portfolio: portfolioReducer,
    prices: pricesReducer,
    accounts: accountsReducer,
    settings: settingsReducer,
});
