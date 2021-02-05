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
    const first150TokenAddresses = tokens.map((token) => token.address);
    const coingeckoIds = {};
    let i = 1;
    for (const tokenAddress of first150TokenAddresses) {
        console.log(`${i}/50`);
        const coingeckoResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`
        );
        const { id } = await coingeckoResponse.json();
        if (!id) {
            continue;
        }
        coingeckoIds[tokenAddress] = id;
        i++;
    }
    fs.writeFile(
        `${__dirname}/../assets/json/ethereum-tokens-coingecko-ids-precache.json`,
        JSON.stringify(coingeckoIds, null, 4),
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
