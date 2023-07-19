// libraries providers
import ChakraUIProvider from "./ChakraUIProvider";
import RainbowkitProviders from "./RainbowkitProvider";
import { WagmiProvider } from "./WagmiProvider";

// contract provider
import { TokenPHARMProvider } from "./TokenPHARMProvider";
import { DataStorageProvider } from "./DataStorageProvider";
import { FreePharmaProvider } from "./FreePharmaProvider";
import { PriceProviderProvider } from "./PriceProviderProvider";
import { StackingManagerProvider } from "./StackingManagerProvider";

export function Providers({ children }) {
    return (
        <ChakraUIProvider>
            <RainbowkitProviders>
                <WagmiProvider>
                    <TokenPHARMProvider>
                        <DataStorageProvider>
                            <FreePharmaProvider>
                                <PriceProviderProvider>
                                    <StackingManagerProvider>
                                        {children}
                                    </StackingManagerProvider>
                                </PriceProviderProvider>
                            </FreePharmaProvider>
                        </DataStorageProvider>
                    </TokenPHARMProvider>
                </WagmiProvider>
            </RainbowkitProviders>
        </ChakraUIProvider>
    );
}
