import { PORTFOLIO_SOURCE } from "../../../commons";
import { getEthPortfolio } from "./eth";
import { getBitcoinPortfolio } from "./btc";
import { getQtumPortfolio } from "./qtum";
import { getNeoPortfolio } from "./neo";
import { getXlmPortfolio } from "./xlm";
import { getLoopringPortfolio } from "./loopring";
import { getBinancePortfolio } from "./binance";

export const getPortfolioByAccountType = async (account, coinGeckoIds) => {
    switch (account.type) {
        case PORTFOLIO_SOURCE.ETH: {
            return await getEthPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.BTC: {
            return await getBitcoinPortfolio(
                account.fields.address,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.QTUM: {
            return await getQtumPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.NEO: {
            return await getNeoPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.XLM: {
            return await getXlmPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.LOOPRING: {
            return await getLoopringPortfolio(
                account.fields.accountId,
                account.fields.apiKey,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.BINANCE: {
            return await getBinancePortfolio(
                account.fields.apiKey,
                account.fields.apiSecret,
                coinGeckoIds
            );
        }
        default: {
        }
    }
};
