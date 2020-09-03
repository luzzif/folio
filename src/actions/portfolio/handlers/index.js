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
        case PORTFOLIO_SOURCE.ETH_WALLET: {
            return await getEthPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.BTC_WALLET: {
            return await getBitcoinPortfolio(
                account.fields.address,
                coinGeckoIds
            );
        }
        case PORTFOLIO_SOURCE.QTUM_WALLET: {
            return await getQtumPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.NEO_WALLET: {
            return await getNeoPortfolio(account.fields.address, coinGeckoIds);
        }
        case PORTFOLIO_SOURCE.XLM_WALLET: {
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
