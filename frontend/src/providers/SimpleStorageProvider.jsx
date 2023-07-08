import { createContext, useMemo } from "react";
import { useSimpleStorage } from "@/hooks/useSimpleStorage";

export const SimpleStorageContext = createContext();

export const SimpleStorageProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,
        storedValue,

        // Functions
        setValue,

        // Events
        valueStoredLogs,

        // Data
        valueStoredData,
    } = useSimpleStorage();

    const values = useMemo(
        () => ({
            // Static data
            contractAddress,

            // State contract
            contract,
            storedValue,

            // Functions
            setValue,

            // Events
            valueStoredLogs,

            // Data
            valueStoredData,
        }),
        [
            // Static data
            contractAddress,

            // State contract
            contract,
            storedValue,

            // Functions
            setValue,

            // Events
            valueStoredLogs,

            // Data
            valueStoredData,
        ]
    );

    // Contexts
    return (
        <SimpleStorageContext.Provider value={values}>
            {children}
        </SimpleStorageContext.Provider>
    );
};
