import { getBtcFromSatoshis } from "../../../../utils";
import Decimal from "decimal.js";

export const getBitcoinPortfolio = async (address, coinGeckoIds) => {
    const response = await fetch(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
    );
    if (!response.ok) {
        throw new Error("invalid response");
    }
    const json = await response.json();
    const { balance } = json;
    return [
        {
            symbol: "BTC",
            balance: getBtcFromSatoshis(new Decimal(balance)).toFixed(),
            coinGeckoId: coinGeckoIds.btc,
        },
    ];
};
