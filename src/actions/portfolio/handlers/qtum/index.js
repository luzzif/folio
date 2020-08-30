import {
    getInfoFromCoinGecko,
    getBtcFromSatoshis,
    decimalFromSatoshis,
} from "../../../../utils";
import Decimal from "decimal.js";

export const getQtumPortfolio = async (address, fiatCurrency, coinGeckoIds) => {
    const response = await fetch(`https://qtum.info/api/address/${address}`);
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const portfolio = [];
    const { balance, qrc20Balances } = json;
    if (qrc20Balances && qrc20Balances.length > 0) {
        for (const token of qrc20Balances) {
            const { symbol, decimals } = token;
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
                balance: decimalFromSatoshis(
                    new Decimal(token.balance),
                    decimals
                ),
                info,
            });
        }
    }
    portfolio.push({
        symbol: "QTUM",
        balance: getBtcFromSatoshis(new Decimal(balance)).toFixed(),
        info: await getInfoFromCoinGecko(coinGeckoIds.qtum, fiatCurrency),
    });
    return portfolio;
};
