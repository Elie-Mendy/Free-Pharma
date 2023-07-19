import { createContext, useMemo } from "react";
import { useFreePharma } from "@/hooks/useFreePharma";

export const FreePharmaContext = createContext();

export const FreePharmaProvider = ({ children }) => {
    const {
        // Static data
        contractAddress,

        // State contract
        contract,
        currentUser,

        // Functions
        createFreelancer,
        getOneFreelancer,
        setFreelancer,
        applyForJob,
        confirmCandidature,
        completeFreelancerJob,
        claimSalary,

        createEmployer,
        getOneEmployer,
        setEmployer,
        hireFreelancer,
        completeEmployerJob,

        createJob,
        getOneJob,
        setJob,

        // Events

        // Data
    } = useFreePharma();

    const values = useMemo(
        () => ({
            // Static data
            contractAddress,

            // State contract
            contract,
            currentUser,

            // Functions
            createFreelancer,
            getOneFreelancer,
            setFreelancer,
            applyForJob,
            confirmCandidature,
            completeFreelancerJob,
            claimSalary,

            createEmployer,
            getOneEmployer,
            setEmployer,
            hireFreelancer,
            completeEmployerJob,

            createJob,
            getOneJob,
            setJob,

            // Events

            // Data
        }),
        [
            // Static data
            contractAddress,

            // State contract
            contract,
            currentUser,
            
            // Functions
            createFreelancer,
            getOneFreelancer,
            setFreelancer,
            applyForJob,
            confirmCandidature,
            completeFreelancerJob,
            claimSalary,

            createEmployer,
            getOneEmployer,
            setEmployer,
            hireFreelancer,
            completeEmployerJob,

            createJob,
            getOneJob,
            setJob,

            // Events

            // Data
        ]
    );

    // Contexts
    return (
        <FreePharmaContext.Provider value={values}>
            {children}
        </FreePharmaContext.Provider>
    );
};
