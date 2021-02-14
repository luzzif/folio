import Decimal from "decimal.js";
import { decimalFromWei } from "../../../../utils";
import staticEthereumTokensCoingeckoIdsCache from "../../../../../assets/json/ethereum-tokens-coingecko-ids-indexed-by-address.json";
import { ethereumTokensCoinGeckoIdsCache } from "../../../../../cache";

export const getLoopringPortfolio = async (accountId, apiKey, coinGeckoIds) => {
    try {
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
            const {
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                address: tokenAddress,
            } = tokens.find((token) => token.tokenId === tokenId);
            if (!tokenSymbol) {
                continue;
            }
            let coinGeckoId =
                tokenAddress === "0x0000000000000000000000000000000000000000"
                    ? "ethereum"
                    : staticEthereumTokensCoingeckoIdsCache[tokenAddress] ||
                      (await ethereumTokensCoinGeckoIdsCache.get(
                          tokenAddress
                      )) ||
                      coinGeckoIds[tokenSymbol.toLowerCase()];
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
    } catch (error) {
        console.error("error fetching loopring portfolio", error);
        throw error;
    }
};
