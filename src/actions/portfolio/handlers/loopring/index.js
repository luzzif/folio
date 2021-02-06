import Decimal from "decimal.js";
import { decimalFromWei } from "../../../../utils";

export const getLoopringPortfolio = async (accountId, apiKey, coinGeckoIds) => {
    let response = await fetch(
        "https://api3.loopring.io/api/v2/exchange/tokens"
    );
    const { data: tokens } = await response.json();
    response = await fetch(
        `https://api3.loopring.io/api/v2/user/balances?accountId=${accountId}`,
        { headers: { "X-API-KEY": apiKey } }
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const { data: balances } = await response.json();
    const portfolio = [];
    for (const balance of balances) {
        const { tokenId, totalAmount } = balance;
        const { symbol: tokenSymbol, decimals: tokenDecimals } = tokens.find(
            (token) => token.tokenId === tokenId
        );
        if (!tokenSymbol) {
            continue;
        }
        const coinGeckoId = coinGeckoIds[tokenSymbol.toLowerCase()];
        if (!coinGeckoId) {
            continue;
        }
        portfolio.push({
            symbol: tokenSymbol,
            balance: decimalFromWei(
                new Decimal(totalAmount),
                tokenDecimals
            ).toFixed(),
            coinGeckoId,
        });
    }
    return portfolio;
};
