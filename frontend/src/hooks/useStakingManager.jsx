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

import { config, client } from "@/config";
import { useTokenPHARM } from "./useTokenPHARM";
import { parseEther, parseAbiItem } from "viem";

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
    const [demoMode, setDemoMode] = useState(false);
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
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // get stored value
        // let globalStakingInfos = await stakingManager.getGlobalStakingInfos();
        let APR = await getAPR();
        let currentUserInfo = await getUser(address);
        let totalValueLocked = await getTotalValueLocked();
        let percentageOfTotalStaked = await getPercentageOfTotalStaked(address);
        let bonusCoefficient = await getBonusCoefficient(address);

        // Set state hook
        setContract(stakingManager);
        setDemoMode(await getDemoMode());
        setcurrentUserStakingInfos({
            PHARMStaked: convertInUSD(currentUserInfo.pharmAmountStaked),
            ETHStaked: convertInUSD(currentUserInfo.ethAmountStaked),
            PHARMRewards: convertInUSD(currentUserInfo.pendingRewards),
        });
        setTotalValueLocked(convertInUSD(totalValueLocked));
        setPercentageOfTotalStaked(percentageOfTotalStaked);
        setBonusCoefficient(
            parseInt(APR.toString()) / 100 +
                parseInt(bonusCoefficient.toString()) / 100
        );

        console.log("demoMode", demoMode)
    };

    // ::::::::::: Contract Functions :::::::::::

    const switchDemoMode = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
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
                address: contractAddress,
                abi: contractABI,
                functionName: "DemoMode",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getAPR = async () => {
        try {
            const data = await readContract({
                address: contractAddress,
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

    const getTotalValueLocked = async () => {
        try {
            const data = await readContract({
                address: contractAddress,
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
                address: contractAddress,
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
                address: contractAddress,
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
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
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

    const stakeETH = async (_amount) => {
        if (!_amount) {
            throwNotif("error", "Veuillez entrer un montant");
            return;
        }
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
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

    const getSkakingPHARMDeposits = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000);

        const depositsLogs = await client.getLogs({
            address: contractAddress,
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
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000);

        const withdrawalsLogs = await client.getLogs({
            address: contractAddress,
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
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000);

        const depositsLogs = await client.getLogs({
            address: contractAddress,
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
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000);

        const withdrawalsLogs = await client.getLogs({
            address: contractAddress,
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
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000);

        const rewardsLogs = await client.getLogs({
            address: contractAddress,
            event: parseAbiItem(
                "event ClaimRewards(address indexed userAddress, uint amount, uint timestamp)"
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

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract();

            // get events logs
            getSkakingPHARMDeposits();
            getSkakingPHARMWithdrawals();
            getSkakingETHDeposits();
            getSkakingETHWithdrawals();
            getSkakingRewards();
        } catch (error) {
            throwNotif("error", "Erreur lors du chargement du contrat.");
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: HELPER :::::::::::

    const convertInUSD = (_amount) => {
        return Math.round((_amount.toString() / 10 ** 18) * 100) / 100;
    };

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        contractAddress,

        // State contract
        demoMode,
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
