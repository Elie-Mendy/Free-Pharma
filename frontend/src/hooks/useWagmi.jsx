
import { useAccount, useNetwork } from "wagmi";

export function useWagmi() {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        isConnected,
        address,
        chain
    };
}
