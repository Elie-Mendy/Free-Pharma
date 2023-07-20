import { createContext, useMemo } from "react";
import { useStakingManager } from "@/hooks/useStakingManager";

export const StakingManagerContext = createContext();

export const StakingManagerProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,
        currentUserStakingInfos,
        pharmDeposits,
        pharmWithdrawals,
        ethDeposits,
        ethWithdrawals,
        stackingRewards,

        // FunctionsstakePHARM,
        stakePHARM,
        unstakePHARM,
        stakeETH,
        unstakeETH,
        claimRewards,

        // Events

        // Data
    } = useStakingManager();

    const values = useMemo(
        () => ({
            // Static data
            contractAddress,
            currentUserStakingInfos,
            pharmDeposits,
            pharmWithdrawals,
            ethDeposits,
            ethWithdrawals,
            stackingRewards,

            // State contract
            contract,

            // FunctionsstakePHARM,
            stakePHARM,
            unstakePHARM,
            stakeETH,
            unstakeETH,
            claimRewards,

            // Events

            // Data
        }),
        [
            // Static data
            contractAddress,

            // State contract
            contract,
            currentUserStakingInfos,
            pharmDeposits,
            pharmWithdrawals,
            ethDeposits,
            ethWithdrawals,
            stackingRewards,

            // FunctionsstakePHARM,
            stakePHARM,
            unstakePHARM,
            stakeETH,
            unstakeETH,
            claimRewards,

            // Events

            // Data
        ]
    );

    // Contexts
    return (
        <StakingManagerContext.Provider value={values}>
            {children}
        </StakingManagerContext.Provider>
    );
};
