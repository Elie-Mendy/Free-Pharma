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

import { config } from "@/config";
import { useTokenPHARM } from "./useTokenPHARM";

const contractAddress = config.contracts.StakingManager.address;
const contractABI = config.contracts.StakingManager.abi;

export function useStakingManager() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const { allowance } = useTokenPHARM();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [contract, setContract] = useState({});
    const [currentUserStakingInfos, setcurrentUserStakingInfos] = useState({});

    // ::::::::::: LOGS & DATA :::::::::::
    // const [valueStoredLogs, setValueStoredLogs] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const stekingManager = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // get stored value

        // Set state hook
        setContract(stekingManager);
        setcurrentUserStakingInfos(await getUser(address));
    };

    // ::::::::::: Contract Functions :::::::::::

    const getUser = async (_userAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getUser",
                args: [_userAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const stakePHARM = async (_amount) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "stakePHARM",
                args: [Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "PHARM staked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const unstakePHARM = async (_amount) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "unstakePHARM",
                args: [Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "PHARM unstaked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const stakeETH = async () => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "stakeETH",
                args: [Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "ETH staked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const unstakeETH = async (_amount) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "unstakeETH",
                args: [Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "ETH unstaked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const claimRewards = async () => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "claimRewards",
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Reward unstaked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

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
        currentUserStakingInfos,

        // Functions

        // Events

        // Data
    };
}
