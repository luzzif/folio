import React from "react";
import { BottomSwitcher } from "../bottom-switcher";
import { Portfolio } from "../../views/portfolio";
import { Accounts } from "../../views/accounts";
import { Settings } from "../../views/settings";

export const Home = () => {
    return (
        <BottomSwitcher
            items={[
                {
                    key: "portfolio",
                    title: "Portfolio",
                    component: Portfolio,
                },
                {
                    key: "accounts",
                    title: "Accounts",
                    component: Accounts,
                },
                {
                    key: "settings",
                    title: "Settings",
                    component: Settings,
                },
            ]}
        />
    );
};
