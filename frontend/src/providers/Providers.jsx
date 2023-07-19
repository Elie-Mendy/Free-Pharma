// libraries providers
import ChakraUIProvider from "./ChakraUIProvider";
import RainbowkitProviders from "./RainbowkitProvider";
import { WagmiProvider } from "./WagmiProvider";

// contract provider
import { TokenPHARMProvider } from "./TokenPHARMProvider";
import { DataStorageProvider } from "./DataStorageProvider";
import { FreePharmaProvider } from "./FreePharmaProvider";
import { PriceProviderProvider } from "./PriceProviderProvider";
import { StakingManagerProvider } from "./StakingManagerProvider";

export function Providers({ children }) {
    return (
        <ChakraUIProvider>
            <RainbowkitProviders>
                <WagmiProvider>
                    <TokenPHARMProvider>
                        <DataStorageProvider>
                            <FreePharmaProvider>
                                <PriceProviderProvider>
                                    <StakingManagerProvider>
                                        {children}
                                    </StakingManagerProvider>
                                </PriceProviderProvider>
                            </FreePharmaProvider>
                        </DataStorageProvider>
                    </TokenPHARMProvider>
                </WagmiProvider>
            </RainbowkitProviders>
        </ChakraUIProvider>
    );
}
