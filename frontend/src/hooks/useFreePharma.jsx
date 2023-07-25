import { useState, useEffect, useContext, useCallback } from "react";
import { useNotif } from "@/hooks/useNotif";
import { useWagmi } from "./useWagmi";

import {
    getWalletClient,
    getContract,
    prepareWriteContract,
    writeContract,
    readContract,
} from "@wagmi/core";

import { config } from "@/config";
import { DataStorageContext } from "@/providers/DataStorageProvider";
import { getAddress } from "viem";
import { useContractEvent } from "wagmi";

const contractABI = config.contracts.FreePharma.abi;
const FREELANCER_ROLE =
    "0xdee5dd6a5465c6132eda87e8cb3980b287f43d6f5332a897e4a238c66a15aec2";
const EMPLOYER_ROLE =
    "0xfc7c36207174f786648d2e624616a4b40e15fd7f0268b4e36af5057f0c43c835";
export function useFreePharma() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();

    // ::::::::::: STATE :::::::::::
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [userProfile, setUserProfile] = useState("unknown");
    const [contract, setContract] = useState({});
    const [jobs, setJobs] = useState([]);
    const [freelancers, setFreelancers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [currentJobOffers, setCurrentJobOffers] = useState([]);
    const [startedJobOffers, setStartedJobOffers] = useState([]);
    const [completedJobOffers, setCompletedJobOffers] = useState([]);
    const [totalFreelancerEarn, setTotalFreelancerEarn] = useState(0);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = useCallback(async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const freePharma = getContract({
            address: getAddress(config.contracts.FreePharma.address),
            abi: contractABI,
            walletClient,
        });

        // fetch feed data
        setJobs(await getJobs());
        setFreelancers(await getFreelancers());

        // Set state hook
        setContract(freePharma);
        setIsContractLoading(false);
    }, [address]);

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

    // Roles
    const getUserProfile = useCallback(async () => {
        // IsEMployer
        try {
            const data = await readContract({
                address: config.contracts.FreePharma.address,
                abi: config.contracts.FreePharma.abi,
                functionName: "hasRole",
                args: [FREELANCER_ROLE, getAddress(address)],
            });
            console.log("freelancer", data)
            if(data) return;
        } catch (error) {
            setUserProfile("unknown");
        }
        // IsFreelancer
        try {
            const data = await readContract({
                address: config.contracts.FreePharma.address,
                abi: config.contracts.FreePharma.abi,
                functionName: "hasRole",
                args: [EMPLOYER_ROLE, getAddress(address)],
            });
            console.log("employer", data)

            setUserProfile("employer");
        } catch (error) {
            setUserProfile("unknown");
        }
    }, [address]);


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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "confirmCandidature",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Candidate confirmed !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const completeFreelancerJob = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "completeFreelancerJob",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Job completed !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const claimSalary = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "claimSalary",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Salary claimed !");

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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "setEmployer",
                args: [_name, _email, _visible],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Profile updated !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const hireFreelancer = async (_jobId, _freelancerAddress) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "hireFreelancer",
                args: [_jobId, _freelancerAddress],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Freelancer hired !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const completeEmployerJob = async (_jobId) => {
        try {
            const { request } = await prepareWriteContract({
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "completeEmployerJob",
                args: [_jobId],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Job completed !");

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
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "createJob",
                args: [_startDate, _endDate, _salary, _location],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Mission créée avec succès !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const getOneJob = async (_jobId) => {
        try {
            const data = await readContract({
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
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
                address: getAddress(config.contracts.FreePharma.address),
                abi: contractABI,
                functionName: "setJob",
                args: [_jobId, _salary, _startDate, _endDate, _location],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Mission modifiée avec succès !");

            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };
    
    // ::::::::::: Contract Watchers :::::::::::
    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerUpdated",
        listener(log) {
            if (String(address) === String(log[0].args.freelancerAddress)) {
                loadFreelancerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerApplied",
        listener(log) {
            if (String(address) === String(log[0].args.freelancerAddress)) {
                loadFreelancerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerConfirmedCandidature",
        listener(log) {
            if (String(address) === String(log[0].args.freelancerAddress)) {
                loadFreelancerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerCompletedJob",
        listener(log) {
            if (String(address) === String(log[0].args.freelancerAddress)) {
                loadFreelancerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerClaimedSalary",
        listener(log) {
            if (String(address) === String(log[0].args.freelancerAddress)) {
                loadFreelancerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "FreelancerPaid",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                if (userProfile == "freelancer")
                    loadFreelancerData();
                else if (userProfile == "employer")
                    loadEmployerData();
            }
        },
    });


    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "EmployerUpdated",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                loadEmployerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "EmployerHiredFreelancer",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                loadEmployerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "EmployerHiredFreelancer",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                loadEmployerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "JobCreated",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                if (userProfile == "freelancer")
                    loadFreelancerData();
                else if (userProfile == "employer")
                    loadEmployerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "EmployerCompletedJob",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                if (userProfile == "freelancer")
                    loadFreelancerData();
                else if (userProfile == "employer")
                    loadEmployerData();
            }
        },
    });



    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "JobCreated",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                loadEmployerData();
            }
        },
    });

    useContractEvent({
        address: getAddress(config.contracts.FreePharma.address),
        abi: config.contracts.FreePharma.abi,
        eventName: "JobUpdated",
        listener(log) {
            if (String(address) === String(log[0].args.employerAddress)) {
                loadEmployerData();
            }
        },
    });
    


    useEffect(() => {
        if (!isConnected || isContractLoading) return;
        try {
            loadContract();
            getUserProfile();
        } catch (error) {
            throwNotif(
                "error",
                "Erreur lors du chargement du contrat. FreePharma"
            );
        }
    }, [isConnected, address, chain?.id]);

    // ::::::::::: Returned data :::::::::::
    return {
        // Static data
        address,

        // State contract
        contract,
        userProfile,
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
