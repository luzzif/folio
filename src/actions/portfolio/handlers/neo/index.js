export const getNeoPortfolio = async (address, coinGeckoIds) => {
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
                continue;
            }
            portfolio.push({
                symbol,
                balance: amount,
                coinGeckoId,
            });
        }
    }
    return portfolio;
};
