import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNotif } from "@/hooks/useNotif";
import { useWagmi } from "./useWagmi";

import {
    getWalletClient,
    getContract,
} from "@wagmi/core";

import { parseAbiItem } from "viem";

import { config, client } from "@/config";

const contractAddress = config.contracts.PriceProvider.address;
const contractABI = config.contracts.PriceProvider.abi;

export function usePriceProvider() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contract, setContract] = useState({});

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        console.log("PRICE PROVIDER : Loading contract...");
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const simpleStorage = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // Set state hook
        setContract(simpleStorage);
        setIsContractLoading(false);
    };


    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        console.log("PRICE PROVIDER : Loading contract...");
        try {
            loadContract();
        } catch (error) {
            throwNotif("error", "Erreur lors du chargement du contrat. PriceProvider");
        }
    }, [
        isConnected,
        address,
        chain?.id
    ]);

    
    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        contractAddress,

        // State contract
        contract,

        // Functions

        // Events

        // Data
    };
}
