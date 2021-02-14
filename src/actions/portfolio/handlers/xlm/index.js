import { normalizeXlmBalance } from "../../../../utils";
import Decimal from "decimal.js";

export const getXlmPortfolio = async (address, coinGeckoIds) => {
    try {
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
            for (const xlmBalance of balances) {
                const { balance, symbol } = normalizeXlmBalance(xlmBalance);
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
    } catch (error) {
        console.error("error fetching xlm portfolio", error);
        throw error;
    }
};
