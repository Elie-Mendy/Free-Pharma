import { useEffect, useState } from "react";

// Rainbowkit
import "@rainbow-me/rainbowkit/styles.css";

import {
    connectorsForWallets,
    RainbowKitProvider,
    lightTheme,
} from "@rainbow-me/rainbowkit";

import {
    metaMaskWallet,
    ledgerWallet,
    walletConnectWallet,
    coinbaseWallet,
    rainbowWallet,
    argentWallet,
    trustWallet,
    injectedWallet
} from '@rainbow-me/rainbowkit/wallets';

// Wagmi provider
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    goerli,
    hardhat,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// wagmi config
const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, sepolia, goerli, hardhat],
    [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }),
            metaMaskWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
    {
        groupName: 'Others',
        wallets: [
            walletConnectWallet({ projectId, chains }),
            coinbaseWallet({ chains, appName: projectId }),
            trustWallet({ projectId, chains }),
            rainbowWallet({ projectId, chains }),
            argentWallet({ projectId, chains }),
        ],
    },
]);

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
