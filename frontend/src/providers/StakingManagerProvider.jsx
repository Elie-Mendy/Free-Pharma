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
