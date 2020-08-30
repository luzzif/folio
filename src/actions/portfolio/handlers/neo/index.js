import { getInfoFromCoinGecko } from "../../../../utils";
import Decimal from "decimal.js";

export const getNeoPortfolio = async (address, fiatCurrency, coinGeckoIds) => {
    const response = await fetch(
        `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const portfolio = [];
    const { balance } = json;
    if (balance && balance.length > 0) {
        for (const asset of balance) {
            const { asset_symbol: symbol, amount } = asset;
            const coinGeckoId = coinGeckoIds[symbol.toLowerCase()];
            if (!coinGeckoId) {
                console.warn(`could not get coingecko id for symbol ${symbol}`);
                continue;
            }
            const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
            if (new Decimal(info.circulatingSupply).isZero()) {
                // the token was dismissed
                continue;
            }
            portfolio.push({
                symbol,
                balance: amount,
                info,
            });
        }
    }
    return portfolio;
};
