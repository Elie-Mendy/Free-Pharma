import { createContext, useMemo } from "react";
import { useStackingManager } from "@/hooks/useStackingManager";

export const StackingManagerContext = createContext();

export const StackingManagerProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions

        // Events

        // Data
    } = useStackingManager();

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
        <StackingManagerContext.Provider value={values}>
            {children}
        </StackingManagerContext.Provider>
    );
};
