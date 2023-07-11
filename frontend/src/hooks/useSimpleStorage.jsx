import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNotif } from "@/hooks/useNotif";

import {
    getWalletClient,
    getContract,
    prepareWriteContract,
    writeContract,
    readContract,
    watchContractEvent,
} from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import { parseAbiItem } from "viem";

import { config, client } from "@/config";
const contractAddress = config.contracts.simpleStorage.address;
const contractABI = config.contracts.simpleStorage.abi;

export function useSimpleStorage() {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const { setInfo, setError } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [contract, setContract] = useState({});
    const [storedValue, setStoredValue] = useState(null);

    // ::::::::::: LOGS & DATA :::::::::::
    const [valueStoredLogs, setValueStoredLogs] = useState([]);
    const [valueStoredData, setValueStoredData] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const simpleStorage = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // get stored value
        const value = await getStoredData();
        
        // Set state hook
        setContract(simpleStorage);
        setStoredValue(value.toString());
    };

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract();
            fetchStoredValues();
            setUpListeners();
        } catch (error) {
            toast({
                title: "Error Contract !",
                description: "Impossible de trouver le contract.",
                status: "error",
                duration: 9000,
                position: "top-right",
                isClosable: true,
            });
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: Contract Functions :::::::::::

    const getStoredData = async () => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "storedData",
            });
            return data;
        } catch (err) {
            setError(err.message);
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
            setError(err.message);
        }
    };

    // ::::::::::: Contract Events :::::::::::

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

    // ::::::::::: Data Fetching :::::::::::

    const fetchStoredValues = async () => {
        // get all logs
        console.log(client.chain)
        const ValueStoredLogs = await client.getLogs({
            address: contractAddress,
            event: parseAbiItem("event ValueStored(address author, uint value)"),
            fromBlock: client.chain.name === "Sepolia" ? 3872551n : 0n,
            toBlock: 'latest', // default value, no need to specify 
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

    // ::::::::::: Returned data :::::::::::
    return {
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
    };
}
