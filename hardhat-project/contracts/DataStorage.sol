// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DataStorage is Ownable {
    
    /* ::::::::::::::: STATE  :::::::::::::::::: */

    address public businessLogicContract;
    using Counters for Counters.Counter;
    IERC20 public tokenPHARM; // ERC20 PHARM token
    constructor(address _tokenAddress) {
        tokenPHARM = IERC20(_tokenAddress);
    }


    function setBusinessLogicContract(address _businessLogicContract) public onlyOwner {
        businessLogicContract = _businessLogicContract;
    }

    /// Freelancers

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

    Counters.Counter private _freelancerCount;
    address[] private _freelancersAddresses;
    mapping(address => Freelancer) public freelancers;
    

    /// Employers

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

    Counters.Counter private _employerCount;
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

    Counters.Counter private _jobCount;
    mapping(uint => Job) private jobs;


    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    /// Freelancers

    /// @notice create a new freelancer.
    /// @param _freelancerAddresse the freelancer's address.
    /// @param _name the freelancer's name.
    /// @param _email the freelancer's email.
    /// @param _location the freelancer's location.
    /// @param _averageDailyRate the freelancer's average daily rate.
    /// @param _available the freelancer's availability.
    /// @param _visible the freelancer's visibility.
    function createFreelancer(
        address _freelancerAddresse, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) public {
        freelancers[msg.sender] = Freelancer(
            block.timestamp,
            block.timestamp,
            _averageDailyRate,
            _name,
            _email,
            _location,
            new uint[](0),
            new uint[](0),
            new uint[](0),
            _available,
            _visible
        );
        _freelancerCount.increment();
        _freelancersAddresses.push(_freelancerAddresse);
    }


    /// @notice fetch a freelancer.
    /// @param _freelancerAddresse the freelancer's address.
    /// @return Freelancer, the freelancer.
    function getFreelancer(address _freelancerAddresse) public view returns(Freelancer memory) {
        return freelancers[_freelancerAddresse];
    }

    /// @notice fetch all freelancer jobs applied.
    /// @param _freelancerAddresse the freelancer's address.
    /// @return uint[], an array of job ids.
    function getFreelancerJobApplied(address _freelancerAddresse) public view returns(uint[] memory) {
        return freelancers[_freelancerAddresse].appliedJobIds;
    }

    /// @notice fetch all freelancer jobs hired.
    /// @param _freelancerAddresse the freelancer's address.
    /// @return uint[], an array of job ids.
    function getFreelancerJobHired(address _freelancerAddresse) public view returns(uint[] memory) {
        return freelancers[_freelancerAddresse].hiredJobIds;
    }

    /// @notice fetch all freelancer jobs completed.
    /// @param _freelancerAddresse the freelancer's address.
    /// @return uint[], an array of job ids.
    function getFreelancerJobCompleted(address _freelancerAddresse) public view returns(uint[] memory) {
        return freelancers[_freelancerAddresse].completedJobIds;
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
    /// @param _freelancerAddresse the freelancer's address.
    /// @param _name the freelancer's name.
    /// @param _email the freelancer's email.
    /// @param _location the freelancer's location.
    /// @param _averageDailyRate the freelancer's average daily rate.
    /// @param _available the freelancer's availablility.
    /// @param _visible the freelancer's visibility.
    function setFreelancer(
        address _freelancerAddresse,
        string calldata _name,
        string calldata _email,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) public  {
        freelancers[_freelancerAddresse].updated_at = block.timestamp;
        freelancers[_freelancerAddresse].name = _name;
        freelancers[_freelancerAddresse].email = _email;
        freelancers[_freelancerAddresse].location = _location;
        freelancers[_freelancerAddresse].averageDailyRate = _averageDailyRate;
        freelancers[_freelancerAddresse].available = _available;
        freelancers[_freelancerAddresse].visible = _visible;
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
    /// @dev remove the job id from the freelancer 'hiredJobIds' list.
    /// @dev add the job id into the freelancer 'completedJobIds'.
    /// @dev update the job 'freelancerId' attribute.
    /// @dev update the job status to IN_PROGRESS.
    function confirmCandidature(uint _jobId, address _freelancerAddress) public {
        employers[jobs[_jobId].employerAddress].startedJobOffersIds.push(_jobId);
        employers[jobs[_jobId].employerAddress].currentJobOffersIds = _removeJobIdFromArray(
            _jobId, employers[jobs[_jobId].employerAddress].currentJobOffersIds
        );

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
            _jobId, freelancers[jobs[_jobId].freelancerAddress].hiredJobIds
        );
    }

    /// Employers

    /// @notice create a new employer.
    /// @param _employerAddresses the employer's address.
    /// @param _name the employer's name.
    /// @param _email the employer's email.
    /// @param _visible the employer's visibility.
    function createEmployer(
        address _employerAddresses,
        string calldata _name,
        string calldata _email,
        bool _visible
    ) public {
        employers[_employerAddresses] = Employer(
            block.timestamp,
            block.timestamp,
            _name,
            _email,
            _visible,
            new uint[](0),
            new uint[](0),
            new uint[](0)
        );
        _employerCount.increment();
        _employersAddresses.push(_employerAddresses);
    }

    /// @notice fetch an employer.
    /// @param _employerAddress the employer's address.
    /// @return Employer, the employer.
    function getEmployer(address _employerAddress) public view returns(Employer memory) {
        return employers[_employerAddress];
    }

    /// @notice fetch all freelancers.
    /// @return Freelancer[], an array of freelancers.
    function getEmployers() public view returns(Employer[] memory) {
        Employer[] memory _employers = new Employer[](_employerCount.current());
        for (uint i = 0; i < _employerCount.current(); i++) {
            _employers[i] = employers[_employersAddresses[i]];
        }
        return _employers;
    }

    /// @notice allow an employer to modify his attributes.
    /// @param employerAddress the employer's address.
    /// @param _name the employer's name.
    /// @param _email the employer's email.
    /// @param _visible the employer's visibility.
    function setEmployer(
        address employerAddress,
        string calldata _name,
        string calldata _email,
        bool _visible
    ) public {
        employers[employerAddress].name = _name;
        employers[employerAddress].email = _email;
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
        uint jobId = _jobCount.current();
        jobs[_jobCount.current()] = Job(
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
        _jobCount.increment();
        employers[_employerAddress].currentJobOffersIds.push(jobId);

    }

    /// @notice fetch a job.
    /// @param _jobId the job's id.
    /// @return Job, the job.
    function getJob(uint _jobId) public view returns(Job memory) {
        return jobs[_jobId];
    }

    /// @notice fetch the job status
    /// @param _jobId the job's id.
    /// @return JobStatus, the job status.
    function getJobStatus(uint _jobId) public view returns(JobStatus) {
        return jobs[_jobId].status;
    }

    /// @notice fetch the number of candidates for a given job.
    /// @param _jobId the job's id.
    /// @return uint, the number of candidates.
    function getJobNbCandidates(uint _jobId) public view returns(uint) {
        return jobs[_jobId].candidates.length;
    }

    /// @notice fetch the job employer address.
    /// @param _jobId the job's id.
    /// @return address, the employer address.
    function getJobEmployerAddress(uint _jobId) public view returns(address) {
        return jobs[_jobId].employerAddress;
    }

    /// @notice fetch the job freelancer address.
    /// @param _jobId the job's id.
    /// @return address, the freelancer address.
    function getJobFreelancerAddress(uint _jobId) public view returns(address) {
        return jobs[_jobId].freelancerAddress;
    }


    /// @notice fetch the job salary.
    /// @param _jobId the job's id.
    /// @return uint, the job salary.
    function getJobSalary(uint _jobId) public view returns(uint) {
        return jobs[_jobId].salary;
    }

    /// @notice fetch the job end date.
    /// @param _jobId the job's id.
    /// @return uint, the job end date.
    function getJobEndDate(uint _jobId) public view returns(uint) {
        return jobs[_jobId].endDate;
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
    /// @param _jobId the job id.
    /// @param _freelancerAddress the freelancer address.
    /// @dev remove the job id from the freelancer 'appliedJobIds' list if it's in.
    /// @dev add the job id into the freelancer 'hiredJobIds' list.
    function hireFreelancer(uint _jobId, address _freelancerAddress) public {
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
            _jobId, freelancers[jobs[_jobId].freelancerAddress].hiredJobIds
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
        employers[jobs[_jobId].employerAddress].completedJobOffersIds.push(_jobId);
        employers[jobs[_jobId].employerAddress].startedJobOffersIds = _removeJobIdFromArray(
            _jobId, employers[jobs[_jobId].employerAddress].startedJobOffersIds
        );
        jobs[_jobId].status = JobStatus.PAID;
    }

    

    /* ::::::::::::::: GETTERS :::::::::::::::::: */

    /// @notice fetch the number of job.
    /// @return uint, the number of job.
    function getJobCount() public view returns(uint) {
        return _jobCount.current();
    }

    /// @notice fetch the number of freelancer.
    /// @return uint, the number of freelancer.
    function getFreelancerCount() public view returns(uint) {
        return _freelancerCount.current();
    }

    /// @notice fetch the number of employer.
    /// @return uint, the number of employer.
    function getEmployerCount() public view returns(uint) {
        return _employerCount.current();
    }

    /* :::::::::: HELPERS :::::::::: */

    /// @notice remove a job id from an array.
    /// @param _jobId the job id.
    /// @param _array the array.
    /// @return uint[], the new array.
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

    /// @notice check if a freelancer has applied to a given job.
    /// @param _freelancerAddress the freelancer address.
    /// @param _jobId the job id.
    /// @return bool, true if the freelancer has applied to the job, false otherwise.
    function freelancerAppliedToJob(address _freelancerAddress, uint _jobId) public view returns(bool) {
        for (uint i = 0; i < freelancers[_freelancerAddress].appliedJobIds.length; i++) {
            if (freelancers[_freelancerAddress].appliedJobIds[i] == _jobId) {
                return true;
            }
        }
        return false;
    }

}
