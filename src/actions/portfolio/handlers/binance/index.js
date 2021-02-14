import Decimal from "decimal.js";
import hash from "hash.js";
import staticEthereumTokensCoingeckoIdsIndexedByAddress from "../../../../../assets/json/ethereum-tokens-coingecko-ids-indexed-by-symbol.json";
import { ethereumTokensCoinGeckoIdsCache } from "../../../../../cache";

export const getBinancePortfolio = async (apiKey, apiSecret, coinGeckoIds) => {
    try {
        const params = `timestamp=${Date.now()}`;
        const signature = hash
            .hmac(hash.sha256, apiSecret)
            .update(params)
            .digest("hex");
        const response = await fetch(
            `https://api.binance.com/api/v3/account?${params}&signature=${signature}`,
            {
                headers: {
                    "X-MBX-APIKEY": apiKey,
                },
            }
        );
        if (!response.ok) {
            throw new Error("invalid response");
        }
        const json = await response.json();
        const balances = json.balances.filter(
            (balance) =>
                !new Decimal(balance.free).isZero() ||
                !new Decimal(balance.locked).isZero()
        );
        const portfolio = [];
        for (const balance of balances) {
            const { asset, free, locked } = balance;
            if (!asset) {
                continue;
            }
            // ethereum tokens are favored in this case
            const lowercaseAssetSymbol = asset.toLowerCase();
            let coinGeckoId =
                staticEthereumTokensCoingeckoIdsIndexedByAddress[
                    lowercaseAssetSymbol
                ] ||
                (await ethereumTokensCoinGeckoIdsCache.get(
                    lowercaseAssetSymbol
                )) ||
                coinGeckoIds[lowercaseAssetSymbol];
            if (!coinGeckoId) {
                continue;
            }
            portfolio.push({
                symbol: asset,
                balance: new Decimal(free).plus(locked).toFixed(),
                coinGeckoId,
            });
        }
        return portfolio;
    } catch (error) {
        console.error("error fetching binance portfolio", error);
        throw error;
    }
};
