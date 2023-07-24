import { createPublicClient, http } from "viem";
import { mainnet, sepolia, goerli, polygonMumbai, hardhat } from "viem/chains";
import ABIs from "@/config/ABIs.json";

export const config = {
    chain: process.env.NEXT_PUBLIC_CLIENT_CHAIN,
    contracts: {
        TokenPHARM: {
            address: process.env.NEXT_PUBLIC_TOKEN_PHARM_CONTRACT_ADDRESS,
            abi: ABIs.TokenPHARM,
        },
        DataStorage: {
            address: process.env.NEXT_PUBLIC_DATA_STORAGE_CONTRACT_ADDRESS,
            abi: ABIs.DataStorage,
        },
        FreePharma: {
            address: process.env.NEXT_PUBLIC_FREE_PHARMA_CONTRACT_ADDRESS,
            abi: ABIs.FreePharma,
        },
        PriceProvider: {
            address: process.env.NEXT_PUBLIC_PRICE_PROVIDER_CONTRACT_ADDRESS,
            abi: ABIs.PriceProvider,
        },
        StakingManager: {
            address: process.env.NEXT_PUBLIC_STAKING_MANAGER_CONTRACT_ADDRESS,
            abi: ABIs.StakingManager,
        },
    },
};

const chain =
    process.env.NEXT_PUBLIC_CLIENT_CHAIN === "mainnet"
        ? mainnet
        : process.env.NEXT_PUBLIC_CLIENT_CHAIN === "sepolia"
        ? sepolia
        : process.env.NEXT_PUBLIC_CLIENT_CHAIN === "goerli"
        ? goerli
        : process.env.NEXT_PUBLIC_CLIENT_CHAIN === "mumbai"
        ? polygonMumbai
        : hardhat;

export const client = createPublicClient({
    chain: chain,
    transport: http(),
});
