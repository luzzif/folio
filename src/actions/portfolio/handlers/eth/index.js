import {
    decimalFromWei,
    getEthereumTokenDisambiguatedCoingeckoId,
} from "../../../../utils";
import Decimal from "decimal.js";

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
            const coinGeckoId = await getEthereumTokenDisambiguatedCoingeckoId(
                tokenAddress
            );
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
