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
    const portfolio = [];
    const { final_balance } = json;

    portfolio.push({
        symbol: "BTC",
        balance: getBtcFromSatoshis(new Decimal(final_balance)),
        info: await getInfoFromCoinGecko(coinGeckoIds.btc, fiatCurrency),
    });
    return portfolio;
};
