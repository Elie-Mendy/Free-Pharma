import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useNotif } from "@/hooks/useNotif";
import { useWagmi } from "./useWagmi";

import {
    getWalletClient,
    getContract,
    readContract,
} from "@wagmi/core";


import { config, client } from "@/config";

const contractAddress = config.contracts.DataStorage.address;
const contractABI = config.contracts.DataStorage.abi;

export function useDataStorage() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contract, setContract] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [userProfile, setUserProfile] = useState({});

    // const [storedValue, setStoredValue] = useState("");

    // ::::::::::: LOGS & DATA :::::::::::
    // const [valueStoredLogs, setValueStoredLogs] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = useCallback(async () => {
        console.log("DATA STORAGE : Loading contract...");
        if(!isConnected || !address) return;
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const dataStorage = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        
        // Set state hook
        setContract(dataStorage);
        setIsContractLoading(false);
    },[address]);

    // ::::::::::: Contract Functions :::::::::::

    const getFreelancer = async (_freelancerAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getFreelancer",
                args: [_freelancerAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getEmployer = async (_freelancerAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getEmployer",
                args: [_freelancerAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    

    // ::::::::::: HELPERS :::::::::::

    const getUserInfo = async (_address) => {
        // let freelancer = await getFreelancer(_address);
        // let employer = await getEmployer(_address);

        // if (freelancer && freelancer.created_at != 0) {
        //     setUserProfile("freelancer");
        //     setCurrentUser(freelancer);
        // } else if (employer && employer.created_at != 0) {
        //     await setUserProfile("employer");
        //     setCurrentUser(employer);
        // } else {
        //     setUserProfile("unknown");
        // }
    };

    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        try {
            loadContract();
        } catch (error) {
            throwNotif("error","Erreur lors du chargement du contrat. DataStorage");
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        contractAddress,

        // State contract
        contract,
        currentUser,
        userProfile,
        setUserProfile,

        // Functions

        // Events

        // Data
    };
}
