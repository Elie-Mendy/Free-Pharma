// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DataStorage is AccessControl {
    /* ::::::::::::::: ROLES :::::::::::::::::: */
    
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant BUSINESS_LOGIC_CONTRACT_ROLE = keccak256("BUSINESS_LOGIC_CONTRACT_ROLE");
    
    /* ::::::::::::::: STATE  :::::::::::::::::: */

    using Counters for Counters.Counter;
    IERC20 public tokenPHARM; // ERC20 PHARM token
    error NotAuthorized(string message);
    constructor(address _tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        tokenPHARM = IERC20(_tokenAddress);
    }

    function setBusinessLogicContract(address business_logic_contract) public {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotAuthorized("Only admin can set business logic contract");
        }
        _grantRole(BUSINESS_LOGIC_CONTRACT_ROLE, business_logic_contract);
    }

    /// Freelancers

    struct Freelancer {
        uint created_at;
        uint updated_at;
        uint averageDailyRate;
        string name;
        string location;
        uint[] appliedJobIds; 
        uint[] hiredJobIds; 
        uint[] completedJobIds;
        bool available;
        bool visible;
    }

    Counters.Counter public freelancerCount;
    address[] private _freelancersAddresses;
    mapping(address => Freelancer) public freelancers;
    

    /// Employers

    struct Employer {
        uint created_at;
        uint updated_at;
        string name;
        bool visible;
        uint[] currentJobOffersIds;
        uint[] completedJobOffersIds;
    }

    Counters.Counter public employerCount;
    address[] private _employersAddresses;
    mapping(address => Employer) public employers;


    enum JobStatus {
        OPEN,
        CONFIRMATION_PENDING,
        IN_PROGRESS,
        COMPLETED,
        PAID
    }
    

    /// Jobs

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

    Counters.Counter public jobCount;
    mapping(uint => Job) public jobs;


    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    /// Freelancers

    /// @notice create a new freelancer.
    /// @param _freelancerAddresses the freelancer's address.
    function createFreelancer(address _freelancerAddresses) public {
        freelancers[msg.sender] = Freelancer(
            block.timestamp,
            block.timestamp,
            0,
            "",
            "",
            new uint[](0),
            new uint[](0),
            new uint[](0),
            false,
            false
        );
        freelancerCount.increment();
        _freelancersAddresses.push(_freelancerAddresses);
    }

    /// @notice fetch all freelancers.
    /// @return Freelancer[], an array of freelancers.
    function getFreelancers() public view returns(Freelancer[] memory) {
        Freelancer[] memory _freelancers = new Freelancer[](_freelancersAddresses.length);
        for (uint i = 0; i < _freelancersAddresses.length; i++) {
            _freelancers[i] = freelancers[_freelancersAddresses[i]];
        }
        return _freelancers;
    }

    /// @notice allow a freelancer to modify his attributes.
    /// @param freelancerAddresses the freelancer's address.
    /// @param _name the freelancer's name.
    /// @param _location the freelancer's location.
    /// @param _averageDailyRate the freelancer's average daily rate.
    /// @param _available the freelancer's availablility.
    /// @param _visible the freelancer's visibility.
    function setFreelancer(
        address freelancerAddresses,
        string calldata _name,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) public  {
        freelancers[freelancerAddresses].updated_at = block.timestamp;
        freelancers[freelancerAddresses].name = _name;
        freelancers[freelancerAddresses].location = _location;
        freelancers[freelancerAddresses].averageDailyRate = _averageDailyRate;
        freelancers[freelancerAddresses].available = _available;
        freelancers[freelancerAddresses].visible = _visible;
    }

    /// @notice allow a freelancer to apply for a job.
    /// @param _jobId the job id.
    /// @param _freelancerAddress the freelancer's address.
    function applyForJob(uint _jobId, address _freelancerAddress) public {
        freelancers[_freelancerAddress].appliedJobIds.push(_jobId);
        jobs[_jobId].candidates.push(_freelancerAddress);
        jobs[_jobId].nbCandidates++;
    }

    /// @notice allow a freelancer to confirm his candidature for a job.
    /// @param _jobId the job id.
    /// @param _freelancerAddress the freelancer's address.
    /// @dev update the job 'freelancerId' attribute.
    /// @dev update the job status to IN_PROGRESS.
    function confirmCandidature(uint _jobId, address _freelancerAddress) public {
        jobs[_jobId].freelancerAddress = _freelancerAddress;
        jobs[_jobId].status = JobStatus.IN_PROGRESS;
    }

    /// @notice allow a freelancer to indicate a job as completed.
    /// @param _jobId the job id.
    function completeFreelancerJob(uint _jobId) public {
        jobs[_jobId].completedByFreelancer = true;
        jobs[_jobId].status = JobStatus.COMPLETED;
    }

    /// @notice allow a freelancer to claim his salary if the employer didn't confirmed the job.
    /// @param _jobId the job id.
    /// @dev remove the job id from the freelancer 'hiredJobIds' list.
    /// @dev add the job id into the freelancer 'completedJobIds'.
    function processClaim(uint _jobId) public {
        jobs[_jobId].claimed = true;
        freelancers[jobs[_jobId].freelancerAddress].completedJobIds.push(_jobId);
        freelancers[jobs[_jobId].freelancerAddress].hiredJobIds = _removeJobIdFromArray(
            _jobId, freelancers[jobs[_jobId].freelancerAddress].appliedJobIds
        );
    }

    /// Employers

    /// @notice create a new employer.
    /// @param _employerAddresses the employer's address.
    function createEmployer(address _employerAddresses) public {
        employers[_employerAddresses] = Employer(
            block.timestamp,
            block.timestamp,
            "",
            false,
            new uint[](0),
            new uint[](0)
        );
        employerCount.increment();
        _employersAddresses.push(_employerAddresses);
    }

    /// @notice fetch all freelancers.
    /// @return Freelancer[], an array of freelancers.
    function getEmployers() public view returns(Employer[] memory) {
        Employer[] memory _employers = new Employer[](employerCount.current());
        for (uint i = 0; i < employerCount.current(); i++) {
            _employers[i] = employers[_employersAddresses[i]];
        }
        return _employers;
    }

    /// @notice allow an employer to modify his attributes.
    /// @param employerAddress the employer's address.
    /// @param _name the employer's name.
    /// @param _visible the employer's visibility.
    function setEmployer(
        address employerAddress,
        string calldata _name,
        bool _visible
    ) public {
        employers[employerAddress].name = _name;
        employers[employerAddress].visible = _visible;
        employers[employerAddress].updated_at = block.timestamp;
    }


    /// @notice allow an employer to create a new job.
    /// @param _employerAddress the employer's address.
    /// @param _startDate the new job start date.
    /// @param _endDate the new job enddate.
    /// @param _salary the new job average daily rate.
    /// @param _location the new job location.
    function createJob(
        address _employerAddress,
        uint _startDate,
        uint _endDate,
        uint _salary,
        string calldata _location
    ) public {

        jobs[jobCount.current()] = Job(
            _startDate,
            _endDate,
            _salary,
            0,
            true,
            false,
            false,
            false,
            new address[](0),
            address(0),
            _employerAddress,
            _location,
            JobStatus.OPEN
        );

        jobCount.increment();
    }

    /// @notice allow an employer to modify the attributes of a given job.
    /// @param _jobId the job' id.
    /// @param _salary the potential new job salary.
    /// @param _startDate the potential new start time.
    /// @param _endDate the potential new job end time.
    /// @param _location the potential new job location.
    function setJob(
        uint _jobId,
        uint _salary,
        uint _startDate,
        uint _endDate,
        string calldata _location
    ) public {
        jobs[_jobId].salary = _salary;
        jobs[_jobId].startDate = _startDate;
        jobs[_jobId].endDate = _endDate;
        jobs[_jobId].location = _location;
    }

    /// @notice allow an employer to hire a freelancer.
    /// @param _freelancerAddress the freelancer address.
    /// @param _jobId the job id.
    /// @dev remove the job id from the freelancer 'appliedJobIds' list if it's in.
    /// @dev add the job id into the freelancer 'hiredJobIds' list.
    function hireFreelancer(address _freelancerAddress, uint _jobId) public {
        jobs[_jobId].status = JobStatus.CONFIRMATION_PENDING;
        freelancers[_freelancerAddress].hiredJobIds.push(_jobId);
        freelancers[_freelancerAddress].appliedJobIds = _removeJobIdFromArray(
            _jobId, freelancers[_freelancerAddress].appliedJobIds
        );
    }

    /// @notice allow an employer to indicate a job as completed.
    /// @param _jobId the job id.
    /// @dev define the job's status as completed.
    /// @dev remove the job id from the freelancer 'hiredJobIds' list.
    /// @dev add the job id into the freelancer 'completedJobIds'.
    function completeEmployerJob(uint _jobId) public {
        jobs[_jobId].completedByEmployer = true;
        jobs[_jobId].status = JobStatus.COMPLETED;
        freelancers[jobs[_jobId].freelancerAddress].completedJobIds.push(_jobId);
        freelancers[jobs[_jobId].freelancerAddress].hiredJobIds = _removeJobIdFromArray(
            _jobId, freelancers[jobs[_jobId].freelancerAddress].appliedJobIds
        );
    }

    /// @notice pay the freelancer.
    /// @param _jobId the job id.
    /// @dev can only be called by the function completeEmployerJob().
    /// @dev can't be called once the job has started.
    /// @dev update the job 'paid' attribute.
    function payFreelancer(uint _jobId) public {
        tokenPHARM.transferFrom(
            jobs[_jobId].employerAddress,
            jobs[_jobId].freelancerAddress,
            jobs[_jobId].salary
        );
        jobs[_jobId].status = JobStatus.PAID;
    }

    

    /* ::::::::::::::: GETTERS :::::::::::::::::: */

    function getJobCount() public view returns(uint) {
        return jobCount.current();
    }

    function getFreelancerCount() public view returns(uint) {
        return freelancerCount.current();
    }

    function getEmployerCount() public view returns(uint) {
        return employerCount.current();
    }

    function getFreelancer(address _freelancerAddresses) public view returns(Freelancer memory) {
        return freelancers[_freelancerAddresses];
    }

    function getEmployer(address _employerAddresses) public view returns(Employer memory) {
        return employers[_employerAddresses];
    }

    
    /* :::::::::: HELPERS :::::::::: */

    function _removeJobIdFromArray(uint _jobId, uint[] memory _array) private pure returns(uint[] memory) {
        uint[] memory newArray = new uint[](_array.length - 1);
        uint j = 0;
        for (uint i = 0; i < _array.length; i++) {
            if (_array[i] != _jobId) {
                newArray[j] = _array[i];
                j++;
            }
        }
        return newArray;
    }

    function freelancerAppliedToJob(address _freelancerAddress, uint _jobId) public view returns(bool) {
        for (uint i = 0; i < freelancers[_freelancerAddress].appliedJobIds.length; i++) {
            if (freelancers[_freelancerAddress].appliedJobIds[i] == _jobId) {
                return true;
            }
        }
        return false;
    }

    function getJobStatus(uint _jobId) public view returns(JobStatus) {
        return jobs[_jobId].status;
    }

    function getJobNbCandidates(uint _jobId) public view returns(uint) {
        return jobs[_jobId].candidates.length;
    }

    function getJobEmployerAddress(uint _jobId) public view returns(address) {
        return jobs[_jobId].employerAddress;
    }

    function getJobFreelancerAddress(uint _jobId) public view returns(address) {
        return jobs[_jobId].freelancerAddress;
    }

    function getJobSalary(uint _jobId) public view returns(uint) {
        return jobs[_jobId].salary;
    }
}
