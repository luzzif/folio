import { portfolioReducer } from "./portfolio";
import { accountsReducer } from "./accounts";
import { settingsReducer } from "./settings";
import { coinGeckoReducer } from "./coingecko";
import { manualTransactionsReducer } from "./manual-transactions";
import { pinReducer } from "./pin";

export const reducers = {
    portfolio: portfolioReducer,
    accounts: accountsReducer,
    settings: settingsReducer,
    coinGecko: coinGeckoReducer,
    manualTransactions: manualTransactionsReducer,
    pinConfig: pinReducer,
};
