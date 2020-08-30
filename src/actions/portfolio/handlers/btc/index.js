import { getInfoFromCoinGecko, getBtcFromSatoshis } from "../../../../utils";
import Decimal from "decimal.js";

export const getBitcoinPortfolio = async (
    address,
    fiatCurrency,
    coinGeckoIds
) => {
    const response = await fetch(
        `https://blockchain.info/rawaddr/${address}?limit=0`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const { final_balance: finalBalance } = json;

    return [
        {
            symbol: "BTC",
            balance: getBtcFromSatoshis(new Decimal(finalBalance)).toFixed(),
            info: await getInfoFromCoinGecko(coinGeckoIds.btc, fiatCurrency),
        },
    ];
};
