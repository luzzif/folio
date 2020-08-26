import Decimal from "decimal.js";
import { getInfoFromCoinGecko, decimalFromWei } from "../../../../utils";

export const getLoopringPortfolio = async (
    accountId,
    apiKey,
    fiatCurrency,
    coinGeckoIds
) => {
    let response = await fetch(
        "https://api.loopring.io/api/v2/exchange/tokens"
    );
    const { data: tokens } = await response.json();
    response = await fetch(
        `https://api.loopring.io/api/v2/user/balances?accountId=${accountId}`,
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
        const coinGeckoId = coinGeckoIds[tokenSymbol.toLowerCase()];
        if (!coinGeckoId) {
            console.warn(
                `could not get coingecko id for symbol ${tokenSymbol}`
            );
            continue;
        }
        const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
        if (new Decimal(info.circulatingSupply).isZero()) {
            // the token was dismissed
            continue;
        }
        portfolio.push({
            symbol: tokenSymbol,
            balance: decimalFromWei(new Decimal(totalAmount), tokenDecimals),
            info,
        });
    }
    return portfolio;
};
