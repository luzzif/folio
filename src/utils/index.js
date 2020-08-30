import Decimal from "decimal.js";

export const decimalFromWei = (etherDecimal, decimals) =>
    etherDecimal.dividedBy("1e" + decimals);

export const getInfoFromCoinGecko = async (coinGeckoId, fiatCurrency) => {
    const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinGeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    const coin = await response.json();
    const lowerCaseFiatCurrency = fiatCurrency.toLowerCase();
    return {
        icon: coin.image.large,
        circulatingSupply: coin.market_data.circulating_supply,
        currentPrice: coin.market_data.current_price[lowerCaseFiatCurrency],
        priceChangePercentages: {
            "1d": coin.market_data.price_change_percentage_24h,
            "1w": coin.market_data.price_change_percentage_7d,
            "2w": coin.market_data.price_change_percentage_14d,
            "1m": coin.market_data.price_change_percentage_30d,
        },
    };
};

export const getShortenedEthereumAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(
        address.length - 5,
        address.length - 1
    )}`;

export const formatDecimal = (decimal, significantDecimalPlaces = 2) => {
    const decimalPlaces = decimal.decimalPlaces();
    if (decimalPlaces === 0) {
        return decimal.toString();
    }
    const [integers, decimals] = decimal.toFixed(decimalPlaces).split(".");
    let adjustedDecimals = "";
    let significantDecimalPlacesAdded = 0;
    for (let i = 0; i < decimals.length; i++) {
        const char = decimals.charAt(i);
        if (significantDecimalPlacesAdded === 1 && char === "0") {
            // handle cases like 0.0010001, stopping at the first 1
            break;
        }
        adjustedDecimals += char;
        if (
            char !== "0" &&
            ++significantDecimalPlacesAdded === significantDecimalPlaces
        ) {
            break;
        }
    }
    return `${integers}.${adjustedDecimals}`;
};

export const getBtcFromSatoshis = (satoshis) => satoshis.dividedBy(100000000);

export const decimalFromSatoshis = (qtumDecimal, decimals) =>
    qtumDecimal.dividedBy("1e" + decimals);

export const isCoinDismissedBasedOnInfo = (info) =>
    !info.circulatingSupply || new Decimal(info.circulatingSupply).isZero();
