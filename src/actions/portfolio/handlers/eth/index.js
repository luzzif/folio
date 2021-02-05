import {
    decimalFromWei,
    getEthereumTokenDisambiguatedCoingeckoId,
} from "../../../../utils";
import Decimal from "decimal.js";
import staticEthereumTokensCoingeckoIdsCache from "../../../../../assets/json/ethereum-tokens-coingecko-ids-precache.json";
import { ethereumTokensCoinGeckoIdsCache } from "../../../../../cache";

export const getEthPortfolio = async (address, coinGeckoIds) => {
    const response = await fetch(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const portfolio = [];
    const { tokens } = json;
    if (tokens && tokens.length > 0) {
        for (const token of json.tokens) {
            const { address: tokenAddress, symbol, decimals } = token.tokenInfo;
            if (!symbol) {
                continue;
            }
            let coinGeckoId =
                staticEthereumTokensCoingeckoIdsCache[tokenAddress] ||
                ethereumTokensCoinGeckoIdsCache.get(tokenAddress);
            if (!coinGeckoIds) {
                coinGeckoId = await getEthereumTokenDisambiguatedCoingeckoId(
                    tokenAddress
                );
                ethereumTokensCoinGeckoIdsCache.set(tokenAddress, coinGeckoId);
            }
            if (!coinGeckoId) {
                continue;
            }
            portfolio.push({
                symbol,
                balance: decimalFromWei(
                    new Decimal(token.balance),
                    decimals
                ).toFixed(),
                coinGeckoId,
            });
        }
    }
    portfolio.push({
        symbol: "ETH",
        balance: json.ETH.balance,
        coinGeckoId: coinGeckoIds.eth,
    });
    return portfolio;
};
