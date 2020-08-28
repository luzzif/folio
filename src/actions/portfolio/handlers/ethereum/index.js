import {
    getInfoFromCoinGecko,
    decimalFromWei,
    isCoinDismissedBasedOnInfo,
} from "../../../../utils";
import Decimal from "decimal.js";

export const getEthereumPortfolio = async (
    address,
    fiatCurrency,
    coinGeckoIds
) => {
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
            const { symbol, decimals } = token.tokenInfo;
            const coinGeckoId = coinGeckoIds[symbol.toLowerCase()];
            if (!coinGeckoId) {
                console.warn(`could not get coingecko id for symbol ${symbol}`);
                continue;
            }
            const info = await getInfoFromCoinGecko(coinGeckoId, fiatCurrency);
            if (isCoinDismissedBasedOnInfo(info)) {
                continue;
            }
            portfolio.push({
                symbol,
                balance: decimalFromWei(
                    new Decimal(token.balance),
                    decimals
                ).toFixed(),
                info,
            });
        }
    }
    portfolio.push({
        symbol: "ETH",
        balance: json.ETH.balance,
        info: await getInfoFromCoinGecko(coinGeckoIds.eth, fiatCurrency),
    });
    return portfolio;
};
