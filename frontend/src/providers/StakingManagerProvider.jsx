import { createContext, useMemo } from "react";
import { useStakingManager } from "@/hooks/useStakingManager";

export const StakingManagerContext = createContext();

export const StakingManagerProvider = ({ children }) => {
    const {
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

        // FunctionsstakePHARM,
        stakePHARM,
        unstakePHARM,
        stakeETH,
        unstakeETH,
        claimRewards,
        switchDemoMode,

        // Events

        // Data
    } = useStakingManager();

    const values = useMemo(
        () => ({
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

            // FunctionsstakePHARM,
            stakePHARM,
            unstakePHARM,
            stakeETH,
            unstakeETH,
            claimRewards,
            switchDemoMode,

            // Events

            // Data
        }),
        [
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

            // Functions,
            stakePHARM,
            unstakePHARM,
            stakeETH,
            unstakeETH,
            claimRewards,
            switchDemoMode,

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
