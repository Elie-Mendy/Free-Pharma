import { useEffect, useState } from "react";

// Rainbowkit
import "@rainbow-me/rainbowkit/styles.css";

import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
} from "@rainbow-me/rainbowkit";

// Wagmi provider
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    hardhat,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// wagmi config
const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, sepolia, hardhat],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_APPNAME,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export default function RainbowkitProvider({ children }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                theme={{
                    lightMode: lightTheme({
                        accentColor: "#2b6cb0",
                        overlayBlur: "small",
                        borderRadius: "large",
                    }),
                }}
            >
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
