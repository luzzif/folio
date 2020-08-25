export const bigNumberFromWei = (etherBigNumber, decimals) =>
    etherBigNumber.dividedBy("1e" + decimals);

export const getIconLink = async (symbol) => {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const coins = await response.json();
    const lowerCaseSymbol = symbol.toLowerCase();
    const matchingCoin = coins.find(
        (coin) => coin.symbol.toLowerCase() === lowerCaseSymbol
    );
    if (!matchingCoin) {
        return null;
    }
    response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${matchingCoin.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    );
    const coin = await response.json();
    return coin.image.large;
};

export const getShortenedEthereumAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(
        address.length - 5,
        address.length - 1
    )}`;
