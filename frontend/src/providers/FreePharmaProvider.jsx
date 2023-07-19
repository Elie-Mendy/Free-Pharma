import { createContext, useMemo } from "react";
import { useFreePharma } from "@/hooks/useFreePharma";

export const FreePharmaContext = createContext();

export const FreePharmaProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions
        createFreelancer,

        // Events

        // Data
    } = useFreePharma();

    const values = useMemo(
        () => ({
            // Static data
            contractAddress,

            // State contract
            contract,

            // Functions
            createFreelancer,

            // Events

            // Data
        }),
        [
            // Static data
            contractAddress,

            // State contract
            contract,

            // Functions
            createFreelancer,

            // Events

            // Data
        ]
    );

    // Contexts
    return (
        <FreePharmaContext.Provider value={values}>
            {children}
        </FreePharmaContext.Provider>
    );
};
