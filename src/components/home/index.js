import React from "react";
import { BottomSwitcher } from "../bottom-switcher";
import { Portfolio } from "../../views/portfolio";
import { Accounts } from "../../views/accounts";
import { Settings } from "../../views/settings";
import { faChartPie, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
    return (
        <BottomSwitcher
            items={[
                {
                    key: "portfolio",
                    title: "Portfolio",
                    faIcon: faChartPie,
                    component: Portfolio,
                },
                {
                    key: "accounts",
                    title: "Accounts",
                    faIcon: faUsers,
                    component: Accounts,
                },
                {
                    key: "settings",
                    title: "Settings",
                    faIcon: faCog,
                    component: Settings,
                },
            ]}
        />
    );
};
