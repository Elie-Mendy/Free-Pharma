import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNotif } from "@/hooks/useNotif";
import { useWagmi } from "./useWagmi";

import {
    getWalletClient,
    getContract,
    prepareWriteContract,
    writeContract,
    readContract,
    watchContractEvent,
} from "@wagmi/core";

import { parseAbiItem } from "viem";

import { config, client } from "@/config";

const contractAddress = config.contracts.DataStorage.address;
const contractABI = config.contracts.DataStorage.abi;

export function useDataStorage() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [contract, setContract] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [userProfile, setUserProfile] = useState({});

    // const [storedValue, setStoredValue] = useState("");

    // ::::::::::: LOGS & DATA :::::::::::
    // const [valueStoredLogs, setValueStoredLogs] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const dataStorage = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // get stored value
        await getUserInfo(address)

        // Set state hook
        setContract(dataStorage);
    };


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




    /*
    const getStoredData = async () => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "storedData",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };
    const setValue = async (_value) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "set",
                args: [Number(_value)],
            });
            const { hash } = await writeContract(request);
            setInfo("Value stored !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };
    */

    // ::::::::::: Contract Events :::::::::::

    /*
    function setUpListeners() {
        // event VoterRegistered
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "ValueStored",
            },
            (log) => {
                fetchStoredValues();
            }
        );
    }
    */

    // ::::::::::: Data Fetching :::::::::::

    /*
    const fetchStoredValues = async () => {
        // get all logs
        const ValueStoredLogs = await client.getLogs({
            address: contractAddress,
            event: parseAbiItem(
                "event ValueStored(address author, uint value)"
            ),
            fromBlock: client.chain.name === "Sepolia" ? 3872551n : 0n,
            toBlock: "latest", // default value, no need to specify
        });
        setValueStoredLogs(ValueStoredLogs);

        // process data
        const processedValueStored = await Promise.all(
            ValueStoredLogs.map(async (log) => {
                return { author: log.args.author, value: log.args.value };
            })
        );
        setValueStoredData(
            processedValueStored.map((storedValue) => ({
                author: storedValue.author,
                value: storedValue.value.toString(),
            }))
        );

        // Set state hook
        const value = await getStoredData();
        setStoredValue(value.toString());
    };
    */

    // ::::::::::: HELPERS :::::::::::

    const getUserInfo = async (_address) => {
        let freelancer = await getFreelancer(_address);
        let employer = await getEmployer(_address);
        if(freelancer && freelancer.created_at != 0) {
            setUserProfile("freelancer");
            setCurrentUser(freelancer);
            
        } else if (employer && employer.created_at != 0) {
            setUserProfile("employer");
            setCurrentUser(employer);
        } else {
            setUserProfile("unknown")
        }
    };


    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract();
            // fetchStoredValues();
            // setUpListeners();
        } catch (error) {
            toast({
                title: "Error Contract !",
                description: "Erreur lors du chargement du contrat.",
                status: "error",
                duration: 9000,
                position: "top-right",
                isClosable: true,
            });
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
