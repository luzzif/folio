import {
    decimalFromWei,
    getEthereumTokenDisambiguatedCoingeckoId,
} from "../../../../utils";
import Decimal from "decimal.js";
import staticEthereumTokensCoingeckoIdsIndexedByAddress from "../../../../../assets/json/ethereum-tokens-coingecko-ids-indexed-by-address.json";
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
                staticEthereumTokensCoingeckoIdsIndexedByAddress[
                    tokenAddress
                ] || (await ethereumTokensCoinGeckoIdsCache.get(tokenAddress));
            if (typeof coinGeckoId !== "string") {
                coinGeckoId = await getEthereumTokenDisambiguatedCoingeckoId(
                    tokenAddress
                );
                if (!coinGeckoId) {
                    continue;
                }
                await ethereumTokensCoinGeckoIdsCache.set(
                    tokenAddress,
                    coinGeckoId
                );
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
