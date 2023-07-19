// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface IDataStorage {

    /* ::::::::::::::: STRUCTURES  :::::::::::::::::: */

    enum JobStatus {
        OPEN,
        CONFIRMATION_PENDING,
        IN_PROGRESS,
        COMPLETED,
        PAID
    }

    struct Freelancer {
        uint created_at;
        uint updated_at;
        uint averageDailyRate;
        string name;
        string email;
        string location;
        uint[] appliedJobIds; 
        uint[] hiredJobIds; 
        uint[] completedJobIds;
        bool available;
        bool visible;
    }

    struct Employer {
        uint created_at;
        uint updated_at;
        string name;
        string email;
        bool visible;
        uint[] currentJobOffersIds;
        uint[] startedJobOffersIds;
        uint[] completedJobOffersIds;
    }

    struct Job {
        uint startDate;
        uint endDate;
        uint salary;
        uint nbCandidates;
        bool visible;
        bool completedByFreelancer;
        bool completedByEmployer;
        bool claimed;
        address[] candidates; 
        address freelancerAddress;
        address employerAddress;
        string location;
        JobStatus status;
    }


    /* ::::::::::::::: FUNCTIONS  :::::::::::::::::: */

    function setBusinessLogicContract(address business_logic_contract) external;

    function createFreelancer(
        address _freelancerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) external;

    function getFreelancers() external view returns(Freelancer[] memory);

    function getFreelancerJobApplied (address _freelancerAddress, uint _jobId) external view returns(bool);

    function getFreelancerJobHired (address _freelancerAddress, uint _jobId) external view returns(bool);

    function getFreelancerJobCompleted (address _freelancerAddress, uint _jobId) external view returns(bool);
    
    function setFreelancer(
        address freelancerAddresses,
        string calldata _name,
        string calldata _email,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) external; 

    function applyForJob(uint _jobId, address _freelancerAddress) external;

    function confirmCandidature(uint _jobId, address _freelancerAddress) external;
    
    function completeFreelancerJob(uint _jobId) external;

    function processClaim(uint _jobId) external;

    function createEmployer(
        address _employerAddresses,
        string calldata _name,
        string calldata _email,
        bool _visible
    ) external;

    function getEmployers() external view returns(Employer[] memory);

    function setEmployer(
        address employerAddress,
        string calldata _name,
        string calldata _email,
        bool _visible
    ) external;

    function createJob(
        address _employerAddress,
        uint _startDate,
        uint _endDate,
        uint _salary,
        string calldata _location
    ) external;

    function getJob(uint _jobId) external view returns(Job memory);

    function getJobStatus(uint _jobId) external view returns(JobStatus);

    function getJobNbCandidates(uint _jobId) external view returns(uint);

    function getJobEmployerAddress(uint _jobId) external view returns(address);

    function getJobFreelancerAddress(uint _jobId) external view returns(address);

    function getJobSalary(uint _jobId) external view returns(uint);

    function getJobEndDate(uint _jobId) external view returns(uint);

    function setJob(
        uint _jobId,
        uint _salary,
        uint _startDate,
        uint _endDate,
        string calldata _location
    ) external;

    function hireFreelancer(uint _jobId, address freelancerAddress) external;

    function completeEmployerJob(uint _jobId) external;

    function payFreelancer(uint _jobId) external;

    function getJobCount() external view returns(uint);

    function getFreelancerCount() external view returns(uint);

    function getEmployerCount() external view returns(uint);
    
    function getFreelancer(address _freelancerAddresses) external view returns(Freelancer memory);

    function getEmployer(address _employerAddresses) external view returns(Employer memory);

    function freelancerAppliedToJob(address _freelancerAddress, uint _jobId) external view returns(bool);

    function freelancerHiredToJob(address _freelancerAddress, uint _jobId) external view returns(bool);
}