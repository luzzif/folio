import Decimal from "decimal.js";
import { getInfoFromCoinGecko } from "../../../../utils";
import hash from "hash.js";

export const getBinancePortfolio = async (
    apiKey,
    apiSecret,
    fiatCurrency,
    coinGeckoIds
) => {
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
        const coinGeckoId = coinGeckoIds[asset.toLowerCase()];
        if (!coinGeckoId) {
            console.warn(`could not get coingecko id for symbol ${asset}`);
            continue;
        }
        const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
        if (new Decimal(info.circulatingSupply).isZero()) {
            // the token was dismissed
            continue;
        }
        portfolio.push({
            symbol: asset,
            balance: new Decimal(free).plus(locked).toFixed(),
            info,
        });
    }
    return portfolio;
};
