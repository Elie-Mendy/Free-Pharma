import { createContext, useMemo } from "react";
import { useTokenPHARM } from "@/hooks/useTokenPHARM";

export const TokenPHARMContext = createContext();

export const TokenPHARMProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions

        // Events

        // Data
    } = useTokenPHARM();

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
        <TokenPHARMContext.Provider value={values}>
            {children}
        </TokenPHARMContext.Provider>
    );
};
