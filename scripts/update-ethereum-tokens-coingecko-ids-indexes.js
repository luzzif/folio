const fetch = require("node-fetch");
const fs = require("fs");

const main = async () => {
    const ethplorerResponse = await fetch(
        "https://api.ethplorer.io/getTopTokens?apiKey=freekey"
    );
    if (!ethplorerResponse.ok) {
        throw new Error("Invalid Ethplorer API response");
    }
    const { tokens } = await ethplorerResponse.json();
    const first50TokensData = tokens.map((token) => ({
        address: token.address,
        symbol: token.symbol,
    }));
    const coingeckoIdsByAddress = {};
    const coingeckoIdsBySymbol = {};
    let i = 1;
    for (const { address, symbol } of first50TokensData) {
        console.log(`${i}/50`);
        const coingeckoResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
        );
        const { id } = await coingeckoResponse.json();
        if (!id) {
            continue;
        }
        coingeckoIdsByAddress[address] = id;
        coingeckoIdsBySymbol[symbol.toLowerCase()] = id;
        i++;
    }
    fs.writeFile(
        `${__dirname}/../assets/json/ethereum-tokens-coingecko-ids-indexed-by-address.json`,
        JSON.stringify(coingeckoIdsByAddress, null, 4),
        (error) => {
            if (error) {
                throw error;
            }
        }
    );
    fs.writeFile(
        `${__dirname}/../assets/json/ethereum-tokens-coingecko-ids-indexed-by-symbol.json`,
        JSON.stringify(coingeckoIdsBySymbol, null, 4),
        (error) => {
            if (error) {
                throw error;
            }
        }
    );
};

main()
    .then(() => {
        console.log(
            "successfully cached coingecko ids for top 150 Ethereum tokens"
        );
    })
    .catch((error) => {
        console.error(
            "error precaching coingecko ids for top 150 Ethereum tokens",
            error
        );
    });
