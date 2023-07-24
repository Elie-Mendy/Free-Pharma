import { useState, useEffect, useCallback } from "react";
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

import { config, client } from "@/config";
import { parseEther, parseAbiItem, getAddress } from "viem";
import { useContractEvent } from "wagmi";


const contractABI = config.contracts.StakingManager.abi;

export function useStakingManager() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const toast = useToast();

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contract, setContract] = useState({});
    const [ethPrice, setEthPrice] = useState(0); // in USD
    const [pharmPrice, setPharmPrice] = useState(0); // in USD
    const [totalValueLocked, setTotalValueLocked] = useState(0);
    const [percentageOfTotalStaked, setPercentageOfTotalStaked] = useState(0);
    const [bonusCoefficient, setBonusCoefficient] = useState(0);
    const [currentUserStakingInfos, setcurrentUserStakingInfos] = useState({});
    const [pharmDeposits, setPharmDeposits] = useState([]);
    const [pharmWithdrawals, setPharmWithdrawals] = useState([]);
    const [ethDeposits, setEthDeposits] = useState([]);
    const [ethWithdrawals, setEthWithdrawals] = useState([]);
    const [stackingRewards, setStackingRewards] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const stakingManager = getContract({
            address: getAddress(config.contracts.StakingManager.address),
            abi: contractABI,
            walletClient,
        });
        setContract(stakingManager);
        setIsContractLoading(false);
    };

    const loadStakingManagerData = async () => {
        // get stored value
        let APR = await getAPR();
        let ETHprice = await getETHprice();
        let PHARMprice = await getPHARMprice();
        let currentUserInfo = await getUser(address);
        let totalValueLocked = await getTotalValueLocked();
        let percentageOfTotalStaked = await getPercentageOfTotalStaked(address);
        let bonusCoefficient = await getBonusCoefficient(address);

        // Set state hook
        setEthPrice(convertInUSD(ETHprice));
        setPharmPrice(convertInUSD(PHARMprice));
        setcurrentUserStakingInfos({
            PHARMStaked: convertInUSD(currentUserInfo?.pharmAmountStaked),
            ETHStaked: convertInUSD(currentUserInfo?.ethAmountStaked),
            PHARMRewards: convertInUSD(currentUserInfo?.pendingRewards),
        });
        setTotalValueLocked(convertInUSD(totalValueLocked));
        setPercentageOfTotalStaked(percentageOfTotalStaked);
        setBonusCoefficient(
            parseInt(APR.toString()) / 100 +
                parseInt(bonusCoefficient.toString()) / 100
        );
    };

    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        try {
            loadContract();
            loadStakingManagerData();

        } catch (error) {
            throwNotif("error", "Erreur lors du chargement du contrat.");
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: Contract Functions :::::::::::

    const switchDemoMode = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "switchDemoMode",
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Demo mode switched !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getDemoMode = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "DemoMode",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getPHARMprice = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "PHARMprice",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getETHprice = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "ETHprice",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getAPR = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "APR",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getUser = async (_userAddress) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "getUser",
                args: [_userAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getTotalValueLocked = async () => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "getTotalValueLocked",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getPercentageOfTotalStaked = async (_userAddress) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "getPercentageOfTotalStaked",
                args: [_userAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getBonusCoefficient = async (_userAddress) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "getBonusCoefficient",
                args: [_userAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const stakePHARM = async (_amount) => {
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
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
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
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

    const stakeETH = async (_amount) => {
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
                abi: contractABI,
                functionName: "stakeETH",
                value: parseEther(_amount),
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "ETH staked !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const unstakeETH = async (_amount) => {
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
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
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.StakingManager.address),
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

    const getSkakingPHARMDeposits = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1500);

        const depositsLogs = await client.getLogs({
            address: getAddress(config.contracts.StakingManager.address),
            event: parseAbiItem(
                "event StakePHARM(address indexed userAddress, uint amount, uint timestamp)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const deposits = (
            await Promise.all(
                depositsLogs.map(async (log, i) => {
                    return {
                        id: Number(i + 1),
                        address: String(log.args.userAddress),
                        amount: convertInUSD(log.args.amount),
                        timestamp: Number(log.args.timestamp),
                        token: "PHARM",
                    };
                })
            )
        ).map((w) => w);

        setPharmDeposits(deposits);
    };

    const getSkakingPHARMWithdrawals = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1500);

        const withdrawalsLogs = await client.getLogs({
            address: getAddress(config.contracts.StakingManager.address),
            event: parseAbiItem(
                "event UnstakePHARM(address indexed userAddress, uint amount, uint timestamp)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const withdrawals = (
            await Promise.all(
                withdrawalsLogs.map(async (log, i) => {
                    return {
                        id: Number(i + 1),
                        address: String(log.args.userAddress),
                        amount: convertInUSD(log.args.amount),
                        timestamp: Number(log.args.timestamp),
                        token: "PHARM",
                    };
                })
            )
        ).map((w) => w);

        setPharmWithdrawals(withdrawals);
    };

    const getSkakingETHDeposits = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1500);

        const depositsLogs = await client.getLogs({
            address: getAddress(config.contracts.StakingManager.address),
            event: parseAbiItem(
                "event StakeETH(address indexed userAddress, uint amount, uint timestamp)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const deposits = (
            await Promise.all(
                depositsLogs.map(async (log, i) => {
                    return {
                        id: Number(i + 1),
                        address: String(log.args.userAddress),
                        amount: convertInUSD(log.args.amount),
                        timestamp: Number(log.args.timestamp),
                        token: "ETH",
                    };
                })
            )
        ).map((w) => w);

        setEthDeposits(deposits);
    };

    const getSkakingETHWithdrawals = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1500);

        const withdrawalsLogs = await client.getLogs({
            address: getAddress(config.contracts.StakingManager.address),
            event: parseAbiItem(
                "event UnstakeETH(address indexed userAddress, uint amount, uint timestamp)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const withdrawals = (
            await Promise.all(
                withdrawalsLogs.map(async (log, i) => {
                    return {
                        id: Number(i + 1),
                        address: String(log.args.userAddress),
                        amount: convertInUSD(log.args.amount),
                        timestamp: Number(log.args.timestamp),
                        token: "ETH",
                    };
                })
            )
        ).map((w) => w);

        setEthWithdrawals(withdrawals);
    };

    const getSkakingRewards = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 1500);

        const rewardsLogs = await client.getLogs({
            address: getAddress(config.contracts.StakingManager.address),
            event: parseAbiItem(
                "event RewardsClaimed(address indexed userAddress, uint amount, uint timestamp)"
            ),
            fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
        });

        const rewards = (
            await Promise.all(
                rewardsLogs.map(async (log, i) => {
                    return {
                        id: Number(i + 1),
                        address: String(log.args.userAddress),
                        amount: convertInUSD(log.args.amount),
                        timestamp: Number(log.args.timestamp),
                        token: "PHARM",
                    };
                })
            )
        ).map((w) => w);

        setStackingRewards(rewards);
    };

    // useEffect(() => {
    //     if (isContractLoading, stakingManager) return;
    //     try {
    //         // get events logs
    //         // getSkakingPHARMDeposits();
    //         // getSkakingPHARMWithdrawals();
    //         // getSkakingETHDeposits();
    //         // getSkakingETHWithdrawals();
    //         // getSkakingRewards();
    //     } catch (error) {
    //         throwNotif("error", "Erreur lors du chargement du contrat.");
    //     }
    // }, [isContractLoading, stakingManager]);

    // ::::::::::: Contract Events Listeners :::::::::::
    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "StakePHARM",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadStakingManagerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "StakeETH",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadStakingManagerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "UnstakePHARM",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadStakingManagerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "UnstakeETH",
        listener(log) {
            if (String(address) === String(log[0].args.userAddress)) {
                loadStakingManagerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.StakingManager.address),
        abi: config.contracts.StakingManager.abi,
        eventName: "RewardsUpdated",
        listener(log) {
            loadStakingManagerData();
        },
    });

    // ::::::::::: HELPER :::::::::::

    const convertInUSD = (_amount) => {
        if(!_amount) return 0;
        return Math.round((_amount.toString() / 10 ** 18) * 100) / 100;
    };

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        isContractLoading,

        // State contract
        ethPrice,
        pharmPrice,
        contract,
        currentUserStakingInfos,
        pharmDeposits,
        pharmWithdrawals,
        ethDeposits,
        ethWithdrawals,
        stackingRewards,
        totalValueLocked,
        percentageOfTotalStaked,
        bonusCoefficient,

        // Functions
        getDemoMode,
        loadStakingManagerData,
        stakePHARM,
        unstakePHARM,
        stakeETH,
        unstakeETH,
        claimRewards,
        switchDemoMode,

        // Events

        // Data
    };
}
