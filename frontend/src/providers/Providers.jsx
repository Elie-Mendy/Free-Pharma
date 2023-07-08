// libraries providers
import ChakraUIProvider from "./ChakraUIProvider";
import RainbowkitProviders from "./RainbowkitProvider";

// contract provider
import { SimpleStorageProvider }  from "./SimpleStorageProvider";

export function Providers({ children }) {
    return (
        <ChakraUIProvider>
            <RainbowkitProviders>
                <SimpleStorageProvider>{children}</SimpleStorageProvider>
            </RainbowkitProviders>
        </ChakraUIProvider>
    );
}
