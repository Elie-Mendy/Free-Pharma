import { createContext, useMemo } from "react";
import { useDataStorage } from "@/hooks/useDataStorage";

export const DataStorageContext = createContext();

export const DataStorageProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions

        // Events

        // Data
    } = useDataStorage();

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
        <DataStorageContext.Provider value={values}>
            {children}
        </DataStorageContext.Provider>
    );
};
