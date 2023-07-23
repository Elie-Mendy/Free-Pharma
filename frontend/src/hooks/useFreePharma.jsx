import { useState, useEffect, useContext, useCallback } from "react";
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
import { DataStorageContext } from "@/providers/DataStorageProvider";

const contractAddress = config.contracts.FreePharma.address;
const contractABI = config.contracts.FreePharma.abi;

export function useFreePharma() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const { userProfile, setUserProfile } = useContext(DataStorageContext);

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contract, setContract] = useState({});
    const [jobs, setJobs] = useState([]);
    const [freelancers, setFreelancers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [currentJobOffers, setCurrentJobOffers] = useState([]);
    const [startedJobOffers, setStartedJobOffers] = useState([]);
    const [completedJobOffers, setCompletedJobOffers] = useState([]);
    const [totalFreelancerEarn, setTotalFreelancerEarn] = useState(0);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const FreePharma = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // fetch feed data
        setJobs(await getJobs());
        setFreelancers(await getFreelancers());

        // Set state hook
        setContract(FreePharma);

        if (userProfile == "freelancer") {
            loadFreelancerData();
        } else if (userProfile == "employer") {
            loadEmployerData();
        }
        setIsContractLoading(false);
    };

    const loadFreelancerData = async () => {
        let freelancer = await getOneFreelancer(address);
        setCurrentUser(freelancer);
        if (!freelancer) return;
        // fetch current job applied
        let currentJobs = await Promise.all(
            freelancer.appliedJobIds.map(async (jobId) => {
                let job = await getOneJob(jobId);
                return { id: Number(jobId), ...job };
            })
        );
        setCurrentJobOffers(currentJobs);

        // fetch started job offers
        let startedJobs = await Promise.all(
            freelancer.hiredJobIds.map(async (jobId) => {
                let job = await getOneJob(jobId);
                return { id: Number(jobId), ...job };
            })
        );
        setStartedJobOffers(startedJobs);

        // fetch completed job offers
        let completedJobs = await Promise.all(
            freelancer.completedJobIds.map(async (jobId) => {
                let job = await getOneJob(jobId);
                return { id: Number(jobId), ...job };
            })
        );
        setCompletedJobOffers(completedJobs);

        // fetch total earn
        if (freelancer.completedJobIds.length === 0) return;
        let totalEarn = completedJobs.reduce((acc, job) => {
            return acc + Number(job.salary);
        }, 0);
        setTotalFreelancerEarn(totalEarn);
    };

    const loadEmployerData = async () => {
        // fetch employer
        let employer = await getOneEmployer(address);
        setCurrentUser(employer);

        if (!employer) return;

        // fetch current job offers
        let currentJobs = await Promise.all(
            employer.currentJobOffersIds.map(
                async (jobId) => await getOneJob(jobId)
            )
        );
        setCurrentJobOffers(currentJobs);

        // fetch started job offers
        let startedJobs = await Promise.all(
            employer.startedJobOffersIds.map(
                async (jobId) => await getOneJob(jobId)
            )
        );
        setStartedJobOffers(startedJobs);

        // fetch completed job offers
        let completedJobs = await Promise.all(
            employer.completedJobOffersIds.map(
                async (jobId) => await getOneJob(jobId)
            )
        );
        setCompletedJobOffers(completedJobs);

        // fetch total paid
        if (employer.completedJobOffersIds.length == 0) return;
        let totalPaid = completedJobs.reduce((acc, job) => {
            return acc + Number(job.salary);
        }, 0);

        setTotalFreelancerEarn(totalPaid);
    };

    // ::::::::::: Contract Functions :::::::::::

    /// Freelancers

    const createFreelancer = async (
        _name = "",
        _email = "",
        _location = "",
        _averageDailyRate = 0,
        _available = false,
        _visible = false
    ) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "createFreelancer",
                args: [
                    _name,
                    _email,
                    _location,
                    _averageDailyRate,
                    _available,
                    _visible,
                ],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Profile created !");
            setUserProfile("freelancer");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getOneFreelancer = async (_freelancerAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getOneFreelancer",
                args: [_freelancerAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getFreelancers = async (_freelancerAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getFreelancers",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const setFreelancer = async (
        _name = "",
        _email = "",
        _location = "",
        _averageDailyRate = 0,
        _available = false,
        _visible = false
    ) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "setFreelancer",
                args: [
                    _name,
                    _email,
                    _location,
                    _averageDailyRate,
                    _available,
                    _visible,
                ],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Profile updated !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const applyForJob = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "applyForJob",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Candidature envoyée !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const confirmCandidature = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "confirmCandidature",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Candidate confirmed !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const completeFreelancerJob = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "completeFreelancerJob",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Job completed !");
            loadContract();

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const claimSalary = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "claimSalary",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Salary claimed !");
            loadContract();

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    /// Employers

    const createEmployer = async (
        _name = "",
        _email = "",
        _visible = false
    ) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "createEmployer",
                args: [_name, _email, _visible],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Profile created !");
            setUserProfile("employer");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getOneEmployer = async (_employerAddress) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getOneEmployer",
                args: [_employerAddress],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const setEmployer = async (_name = "", _email = "", _visible = false) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "setEmployer",
                args: [_name, _email, _visible],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Profile updated !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const hireFreelancer = async (_jobId, _freelancerAddress) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "hireFreelancer",
                args: [_jobId, _freelancerAddress],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Freelancer hired !");
            loadContract();

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const completeEmployerJob = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "completeEmployerJob",
                args: [_jobId],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Job completed !");
            loadContract();

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    /// Jobs

    const createJob = async (
        _startDate,
        _endDate,
        _salary = "",
        _location = ""
    ) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "createJob",
                args: [_startDate, _endDate, _salary, _location],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Mission créée avec succès !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getOneJob = async (_jobId) => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getOneJob",
                args: [_jobId],
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getJobs = async () => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "getJobs",
            });
            return data;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const setJob = async (
        _jobId,
        _salary = "",
        _startDate,
        _endDate,
        _location = ""
    ) => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "setJob",
                args: [_jobId, _salary, _startDate, _endDate, _location],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Mission modifiée avec succès !");
            loadContract();
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const setUpListeners = useCallback(() => {
        // event FreelancerApplied
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "FreelancerApplied",
            },
            (log) => {
                loadContract();
            }
        );

        // event FreelancerApplied
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "FreelancerConfirmedCandidature",
            },
            (log) => {
                loadContract();
            }
        );

        // event FreelancerCompletedJob
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "FreelancerCompletedJob",
            },
            (log) => {
                loadContract();
            }
        );

        // event FreelancerClaimedSalary
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "FreelancerClaimedSalary",
            },
            (log) => {
                loadContract();
            }
        );

        // event FreelancerPaid
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "FreelancerPaid",
            },
            (log) => {
                loadContract();
            }
        );

        // event EmployerHiredFreelancer
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "EmployerHiredFreelancer",
            },
            (log) => {
                loadContract();
            }
        );

        // event EmployerCompletedJob
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "EmployerCompletedJob",
            },
            (log) => {
                loadContract();
            }
        );

        // event JobCreated
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "JobCreated",
            },
            (log) => {
                loadContract();
            }
        );
    }, []);

    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        try {
            loadContract();
            setUpListeners();
        } catch (error) {
            throwNotif("error", "Erreur lors du chargement du contrat.");
        }
    }, [isConnected, address, chain?.id, userProfile]);

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        contractAddress,
        address,

        // State contract
        contract,
        jobs,
        freelancers,
        currentUser,
        currentJobOffers,
        startedJobOffers,
        completedJobOffers,
        totalFreelancerEarn,
        setTotalFreelancerEarn,

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
    };
}
