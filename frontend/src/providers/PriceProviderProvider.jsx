import { createContext, useMemo } from "react";
import { usePriceProvider } from "@/hooks/usePriceProvider";

export const PriceProviderContext = createContext();

export const PriceProviderProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions

        // Events

        // Data
    } = usePriceProvider();

    const values = useMemo(
        () => ({
            // Static data
            contractAddress,

            // State contract
            contract,

            // Functions

            // Events

            // Data
        }),
        [
            // Static data
            contractAddress,

            // State contract
            contract,

            // Functions

            // Events

            // Data
        ]
    );

    // Contexts
    return (
        <PriceProviderContext.Provider value={values}>
            {children}
        </PriceProviderContext.Provider>
    );
};
