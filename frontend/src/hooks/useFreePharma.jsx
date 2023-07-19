import { useState, useEffect, useContext } from "react";
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

import { parseAbiItem } from "viem";

import { config, client } from "@/config";
import { DataStorageContext } from "@/providers/DataStorageProvider";

const contractAddress = config.contracts.FreePharma.address;
const contractABI = config.contracts.FreePharma.abi;

export function useFreePharma() {
    // ::::::::::: CONFIG :::::::::::
    const { isConnected, address, chain } = useWagmi();
    const { throwNotif } = useNotif();
    const { userProfile, setUserProfile } = useContext(DataStorageContext);

    // ::::::::::: STATE :::::::::::
    const [contract, setContract] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [currentJobOffers, setCurrentJobOffers] = useState([]);
    const [startedJobOffers, setStartedJobOffers] = useState([]);
    const [completedJobOffersIds, setCompletedJobOffersIds] = useState([]);

    // ::::::::::: LOGS & DATA :::::::::::
    // const [valueStoredLogs, setValueStoredLogs] = useState([]);

    // ::::::::::: Contract Loading :::::::::::
    const loadContract = async () => {
        // get contract with connected provider
        const walletClient = await getWalletClient();
        const FreePharma = getContract({
            address: contractAddress,
            abi: contractABI,
            walletClient,
        });

        // get stored value

        // Set state hook
        setContract(FreePharma);

        if (userProfile == "freelancer") {
            setCurrentUser(await getOneFreelancer(address));
        } else if (userProfile == "employer") {
            // fetch employer
            let employer = await getOneEmployer(address);
            setCurrentUser(employer);

            // fetch current job offers
            let currentJobs = await Promise.all(
                employer.currentJobOffersIds.map(async (jobId) => {
                    const job = await getOneJob(jobId);
                    return {
                        id: jobId,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        salary: job.salary,
                        candidates: job.candidates,
                        location: job.location,
                    };
                })
            );
            setCurrentJobOffers(currentJobs);

            // fetch started job offers
            let startedJobs = await Promise.all(
                employer.startedJobOffersIds.map(async (jobId) => {
                    const job = await getOneJob(jobId);
                    return {
                        freelancerAddress: job.freelancerAddress,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        salary: job.salary,
                        location: job.location,
                    };
                })
            );
            setStartedJobOffers(startedJobs);

            // fetch completed job offers
            let completedJobs = await Promise.all(
                employer.completedJobOffersIds.map(async (jobId) => {
                    const job = await getOneJob(jobId);
                    return {
                        freelancerAddress: job.freelancerAddress,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        salary: job.salary,
                        location: job.location,
                    };
                })
            );
        }
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
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const applyForJob = async (_jobId) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "applyForJob",
                args: [Number(_jobId)],
            });
            const { hash } = await writeContract(request);
            throwNotif("info", "Applied for job !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    const confirmCandidature = async (_jobId) => {
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
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
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
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
        if (!_value) return;
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
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
            throwNotif("info", "Job created !");
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
            throwNotif("info", "Job updated !");
            return hash;
        } catch (err) {
            throwNotif("error", err.message);
        }
    };

    // ::::::::::: Contract Events :::::::::::

    /*
    function setUpListeners() {
        // event VoterRegistered
        watchContractEvent(
            {
                address: contractAddress,
                abi: contractABI,
                eventName: "ValueStored",
            },
            (log) => {
                fetchStoredValues();
            }
        );
    }
    */

    // ::::::::::: Data Fetching :::::::::::

    /*
    const fetchStoredValues = async () => {
        // get all logs
        const ValueStoredLogs = await client.getLogs({
            address: contractAddress,
            event: parseAbiItem(
                "event ValueStored(address author, uint value)"
            ),
            fromBlock: client.chain.name === "Sepolia" ? 3872551n : 0n,
            toBlock: "latest", // default value, no need to specify
        });
        setValueStoredLogs(ValueStoredLogs);

        // process data
        const processedValueStored = await Promise.all(
            ValueStoredLogs.map(async (log) => {
                return { author: log.args.author, value: log.args.value };
            })
        );
        setValueStoredData(
            processedValueStored.map((storedValue) => ({
                author: storedValue.author,
                value: storedValue.value.toString(),
            }))
        );

        // Set state hook
        const value = await getStoredData();
        setStoredValue(value.toString());
    };
    */

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract();
            // fetchStoredValues();
            // setUpListeners();
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
        currentUser,
        currentJobOffers,
        startedJobOffers,
        completedJobOffersIds,


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
