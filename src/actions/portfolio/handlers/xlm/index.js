import { normalizeXlmBalances } from "../../../../utils";
import Decimal from "decimal.js";

export const getXlmPortfolio = async (address, coinGeckoIds) => {
    const response = await fetch(
        `https://horizon.stellar.org/accounts/${address}`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const portfolio = [];
    const { balances } = json;
    if (balances && balances.length > 0) {
        const normalizedBalances = normalizeXlmBalances(balances);

        for (const normalizedBalance of normalizedBalances) {
            const { balance, symbol } = normalizedBalance;
            if (!symbol) {
                continue;
            }
            const coinGeckoId = coinGeckoIds[symbol.toLowerCase()];
            if (!coinGeckoId) {
                continue;
            }
            portfolio.push({
                symbol,
                balance: new Decimal(balance).toFixed(),
                coinGeckoId,
            });
        }
    }

    return portfolio;
};
