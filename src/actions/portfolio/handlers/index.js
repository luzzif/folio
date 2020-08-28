import { PORTFOLIO_SOURCE } from "../../../commons";
import { getEthereumPortfolio } from "./ethereum";
import { getQuantumPortfolio } from "./quantum";
import { getLoopringPortfolio } from "./loopring";
import { getBinancePortfolio } from "./binance";

export const getPortfolioByAccountType = async (
    account,
    fiatCurrency,
    coinGeckoIds
) => {
    switch (account.type) {
        case PORTFOLIO_SOURCE.ETHEREUM_WALLET: {
            return await getEthereumPortfolio(
                account.fields.address,
                fiatCurrency,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.QUANTUM_WALLET: {
            return await getQuantumPortfolio(
                account.fields.address,
                fiatCurrency,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.LOOPRING: {
            return await getLoopringPortfolio(
                account.fields.accountId,
                account.fields.apiKey,
                fiatCurrency,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.BINANCE: {
            return await getBinancePortfolio(
                account.fields.apiKey,
                account.fields.apiSecret,
                fiatCurrency,
                coinGeckoIds
            );
        }
        default: {
        }
    }
};
