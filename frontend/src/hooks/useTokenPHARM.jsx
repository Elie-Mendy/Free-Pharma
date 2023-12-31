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
} from "@wagmi/core";

import { getAddress, parseAbiItem } from "viem";

import { config, client } from "@/config";
import { useContractEvent } from "wagmi";

const contractAddress = config.contracts.TokenPHARM.address;
const contractABI = config.contracts.TokenPHARM.abi;

export function useTokenPHARM() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contract, setContract] = useState({});
    const [totalSupplyInfo, setTotalSupplyInfo] = useState(0);
    const [balanceOfUser, setBalanceOfUser] = useState(0);
    const [allowanceForFreePharma, setAllowanceForFreePharma] = useState(0);
    const [allowanceForStackingManager, setAllowanceForStackingManager] =
        useState(0);

    // ::::::::::: LOGS & DATA :::::::::::
    // const [valueStoredLogs, setValueStoredLogs] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const tokenPHARM = getContract({
            address: getAddress(config.contracts.TokenPHARM.address),
            abi: contractABI,
            walletClient,
        });
        loadPHARMdata();
        setContract(tokenPHARM);
        setIsContractLoading(false);
    };

    const loadPHARMdata = async () => {
        // get stored value
        let PHARMsupply = await totalSupply();
        if (PHARMsupply === undefined) return;
        PHARMsupply = parseInt(PHARMsupply.toString()) / 10 ** 18;
        PHARMsupply = Math.round(PHARMsupply * 100) / 100;

        let PHARMbalance = await balanceOf(address);
        PHARMbalance = parseInt(PHARMbalance.toString()) / 10 ** 18;
        PHARMbalance = Math.round(PHARMbalance * 100) / 100;

        let PHARMallowanceForFreePharma = await allowance(
            address,
            config.contracts.FreePharma.address
        );
        PHARMallowanceForFreePharma =
            parseInt(PHARMallowanceForFreePharma.toString()) / 10 ** 18;
        PHARMallowanceForFreePharma =
            Math.round(PHARMallowanceForFreePharma * 100) / 100;

        let PHARMallowanceForStackingManager = await allowance(
            address,
            config.contracts.StakingManager.address
        );
        PHARMallowanceForStackingManager =
            parseInt(PHARMallowanceForStackingManager.toString()) / 10 ** 18;
        PHARMallowanceForStackingManager =
            Math.round(PHARMallowanceForStackingManager * 100) / 100;

        // Set state hook
        setTotalSupplyInfo(PHARMsupply.toString());
        setBalanceOfUser(PHARMbalance.toString());
        setAllowanceForFreePharma(PHARMallowanceForFreePharma.toString());
        setAllowanceForStackingManager(
            PHARMallowanceForStackingManager.toString()
        );
    };

    // ::::::::::: Contract Functions :::::::::::

    const totalSupply = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "totalSupply",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const balanceOf = async (_address) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "balanceOf",
                args: [_address],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const allowance = async (_ownerAddress, _spenderAddress) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "allowance",
                args: [_ownerAddress, _spenderAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const approve = async (_address, _amount) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "approve",
                args: [_address, Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Allowance set !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const increaseAllowance = async (_address, _amount) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "increaseAllowance",
                args: [_address, Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Allowance increased !");
            loadPHARMdata();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const decreaseAllowance = async (_address, _amount) => {
        if (!_amount) {
            throwNotif("error", "Amount is required !");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "decreaseAllowance",
                args: [_address, Number(_amount)],
            });

            const { hash } = await writeContract(request);
            throwNotif("info", "Allowance decreased !");
            loadPHARMdata();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const mint = async (_address, _amount) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.TokenPHARM.address),
                abi: contractABI,
                functionName: "mint",
                args: [_address, Number(_amount)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Allowance decreased !");
            loadPHARMdata();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        try {
            loadContract();
        } catch (error) {
            toast({
                title: "Error Contract !",
                description: "Erreur lors du chargement du contrat. TokenPHARM",
                status: "error",
                duration: 9000,
                position: "top-right",
                isClosable: true,
            });
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: Contract Events :::::::::::

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "StakePHARM",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadPHARMdata();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "StakeETH",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadPHARMdata();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "UnstakePHARM",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadPHARMdata();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "UnstakeETH",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadPHARMdata();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "RewardsUpdated",
        listener(log) {
            loadPHARMdata();
        },
    });

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        contractAddress,

        // State contract
        contract,
        totalSupplyInfo,
        balanceOfUser,
        allowanceForFreePharma,
        allowanceForStackingManager,

        // Functions
        loadPHARMdata,
        approve,
        increaseAllowance,
        decreaseAllowance,
        mint,

        // Events

        // Data
    };
}
