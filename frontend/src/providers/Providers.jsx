// libraries providers
import ChakraUIProvider from "./ChakraUIProvider";
import RainbowkitProviders from "./RainbowkitProvider";

// contract provider
import { SimpleStorageProvider } from "./SimpleStorageProvider";
import { WagmiProvider } from "./WagmiProvider";

export function Providers({ children }) {
    return (
        <ChakraUIProvider>
            <RainbowkitProviders>
                <WagmiProvider>
                    <SimpleStorageProvider>{children}</SimpleStorageProvider>
                </WagmiProvider>
            </RainbowkitProviders>
        </ChakraUIProvider>
    );
}
