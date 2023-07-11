import { createContext, useMemo } from "react";
import { useWagmi } from "@/hooks/useWagmi";

export const WagmiContext = createContext();

export const WagmiProvider = ({ children }) => {
    const {
        // Static data
        isConnected,
        address,
        chain,
    } = useWagmi();

    const values = useMemo(
        () => ({
            // Static data
            isConnected,
            address,
            chain,
        }),
        [
            // Static data
            isConnected,
            address,
            chain,
        ]
    );

    // Contexts
    return (
        <WagmiContext.Provider value={values}>{children}</WagmiContext.Provider>
    );
};
