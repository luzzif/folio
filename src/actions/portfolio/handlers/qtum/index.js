import { getBtcFromSatoshis, decimalFromSatoshis } from "../../../../utils";
import Decimal from "decimal.js";

export const getQtumPortfolio = async (address, coinGeckoIds) => {
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
                continue;
            }
            portfolio.push({
                symbol,
                balance: decimalFromSatoshis(
                    new Decimal(token.balance),
                    decimals
                ),
                coinGeckoId,
            });
        }
    }
    portfolio.push({
        symbol: "QTUM",
        balance: getBtcFromSatoshis(new Decimal(balance)).toFixed(),
        coinGeckoId: coinGeckoIds.qtum,
    });
    return portfolio;
};
