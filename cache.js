import AsyncStorage from "@react-native-community/async-storage";
import { Cache } from "react-native-cache";

export const ethereumTokensCoinGeckoIdsCache = new Cache({
    namespace: "coingecko-ids",
    policy: {
        maxEntries: 50000,
    },
    backend: AsyncStorage,
});
