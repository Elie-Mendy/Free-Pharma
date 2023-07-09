// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title FreePharma
 * @author Elie MENDY
 * @notice You can use this contract for only the most educational purpose
 */
contract FreePharma is AccessControl {
    using Counters for Counters.Counter;
    /* ::::::::::::::: ROLES :::::::::::::::::: */

    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");
    bytes32 public constant FREELANCER_ROLE = keccak256("FREELANCER_ROLE");
    

    /* ::::::::::::::: STATE :::::::::::::::::: */

    IERC20 public tokenPHARM; // ERC20 PHARM token
    address public admin;
    address[] public admins;
    uint8 public constant LIMIT_CANDIDATES = 200;
    
    constructor(address _tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN, msg.sender);
        admin = msg.sender;
        admins.push(msg.sender);
        tokenPHARM = IERC20(_tokenAddress);
    }

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
        bool visible;
        uint[] currentJobOffersIds;
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
        address[] candidatesIds; 
        address freelancerAddress;
        address employerAddress;
        string location;
        JobStatus status;
    }

    address[] private _freelancersAddresses;
    mapping(address => Freelancer) public freelancers;

    address[] private _employersAddresses;
    mapping(address => Employer) public employers;

    mapping(uint => Job) public jobs;
    
    Counters.Counter public freelancerCount;
    Counters.Counter public employerCount;
    Counters.Counter public jobCount;

    /* ::::::::::::::: EVENTS :::::::::::::::::: */

    /// @notice Event triggered when a freelancer is created.
    /// @param freelancerAddress the freelancer's address.
    /// @param timestamp the event datetime.
    event FreelancerCreated(address freelancerAddress, uint timestamp);

    /// @notice Event triggered when a freelancer is updated.
    /// @param freelancerAddress the freelancer's address.
    /// @param name the freelancer's name.
    /// @param location the freelancer's location.
    /// @param averageDailyRate the freelancer's average daily rate.
    /// @param available the freelancer's availability.
    /// @param visible the freelancer's visiblility.
    /// @param timestamp the event datetime.
    event FreelancerUpdated(
        address freelancerAddress,
        string name,
        string location,
        uint averageDailyRate,
        bool available,
        bool visible,
        uint timestamp
    );

    /// @notice Event triggered when a freelancer apply for a job.
    /// @param freelancerAddress the freelancer's address.
    /// @param timestamp the event datetime.
    event FreelancerApplied(address freelancerAddress, uint timestamp);

    /// @notice Event triggered when a freelancer confirm his candidature.
    /// @param freelancerAddress the freelancer's address.
    /// @param timestamp the event datetime.
    event FreelancerConfirmedCandidature(address freelancerAddress, uint timestamp);

    /// @notice Event triggered when a freelancer indicate a job as completed.
    /// @param freelancerAddress the freelancer's address.
    /// @param jobId the job's id.
    /// @param timestamp the event datetime.
    event FreelancerCompletedJob(address freelancerAddress, uint jobId, uint timestamp);

    /// @notice Event triggered when a freelancer claim his salary.
    /// @param freelancerAddress the freelancer's address.
    /// @param timestamp the event datetime.
    event FreelancerClaimedSalary(address freelancerAddress, uint jobId, uint timestamp);

    /// @notice Event triggered when a freelancer is paied.
    /// @param freelancerAddress the freelancer's id.
    /// @param jobId the job's id.
    /// @param timestamp the event datetime.
    event FreelancerPaid(
        address freelancerAddress, 
        uint jobId, 
        uint timestamp
    );

    /// @notice Event triggered when an employer is created.
    /// @param employerAddress the employer's address.
    /// @param timestamp the event datetime.
    event EmployerCreated(address employerAddress, uint timestamp);

    /// @notice Event triggered when an employer is updated.
    /// @param employerAddress the employer's address.
    /// @param name the employer's name.
    /// @param visible the employer's visibility.
    /// @param timestamp the event datetime.
    event EmployerUpdated(
        address employerAddress,
        string name,
        bool visible,
        uint timestamp
    );

    /// @notice Event triggered when an employer indicate a job as completed.
    /// @param employerAddress the employer's address.
    /// @param timestamp the event datetime.
    event EmployerCompletedJob(address employerAddress, uint jobId,uint timestamp);

    /// @notice Event triggered when a job is created.
    /// @param id the job's id.
    /// @param employerAddress the employer's address hwo created the job.
    /// @param salary the job's salary.
    /// @param startDate the job's start date.
    /// @param endDate the job's end date.
    /// @param location the job's location.
    /// @param timestamp the event datetime.
    event JobCreated(
        uint id,
        address employerAddress,
        uint startDate,
        uint endDate,
        uint salary,
        string location,
        uint timestamp
    );

    /// @notice Event triggered when a job is updated.
    /// @param id the job's id.
    /// @param salary the job's average daily rate.
    /// @param startDate the job's start date.
    /// @param endDate the job's end date.
    /// @param location the job's location.
    /// @param timestamp the event datetime.
    event JobUpdated(
        uint id,
        uint salary,
        uint startDate,
        uint endDate,
        string location,
        uint timestamp
    );

    /* ::::::::::::::: ERRORS :::::::::::::::::: */

    error NotAuthorized(string message);
    error AlreadyRegistered();
    error FreelancerNotExists();
    error EmployerNotExists();
    error JobNotExists();

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    modifier jobChecked(uint jobId, JobStatus status) {
        if (jobId > jobCount.current()) {
            revert JobNotExists();
        }
        if (jobs[jobId].status != status) {
            revert NotAuthorized("Job status forbid this action");
        }
        _;
    }

    modifier employerChecked(uint jobId) {
        if (jobs[jobId].employerAddress != msg.sender) {
            revert NotAuthorized("You're not the employer of this job");
        }
        _;
    }

    modifier freelancerChecked(uint jobId) {
        if (jobs[jobId].freelancerAddress != msg.sender) {
            revert NotAuthorized("You're not the freelancer of this job");
        }
        _;
    }



    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    /// Freelancers

    /// @notice create a new freelancer.
    /// @dev function called at the first registration of the voter.
    /// @dev emit a FreelancerCreated event.
    function createFreelancer() public {
        if (hasRole(FREELANCER_ROLE, msg.sender)) {
            revert AlreadyRegistered();
        }
        _setupRole(FREELANCER_ROLE, msg.sender);
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
        _freelancersAddresses.push(msg.sender);
        emit FreelancerCreated(msg.sender, block.timestamp);
    }

    /// @notice fetch a freelancer.
    /// @param freelanceAddress, the address of the freelancer.
    /// @return Freelancer, a representation of the selected frelancer.
    function getOneFreelancer(address freelanceAddress) public view returns(Freelancer memory) {
        if (freelancers[freelanceAddress].created_at == 0) {
            revert FreelancerNotExists();
        }
        return freelancers[freelanceAddress];
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
    /// @param freelanceAddress the freelancer's address.
    /// @param _name the freelancer's name.
    /// @param _location the freelancer's location.
    /// @param _averageDailyRate the freelancer's average daily rate.
    /// @param _available the freelancer's availablility.
    /// @param _visible the freelancer's visibility.
    /// @dev can only be called by a freelancer.
    /// @dev emit a FreelancerUpdated event.
    function setFreelancer(
        address freelanceAddress,
        string calldata _name,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) public onlyRole(FREELANCER_ROLE)  {
        if (freelancers[freelanceAddress].created_at == 0) {
            revert FreelancerNotExists();
        }

        freelancers[freelanceAddress].updated_at = block.timestamp;
        freelancers[freelanceAddress].name = _name;
        freelancers[freelanceAddress].location = _location;
        freelancers[freelanceAddress].averageDailyRate = _averageDailyRate;
        freelancers[freelanceAddress].available = _available;
        freelancers[freelanceAddress].visible = _visible;
        emit FreelancerUpdated(
            freelanceAddress, 
            _name, 
            _location, 
            _averageDailyRate, 
            _available,
            _visible, 
            block.timestamp
        );
    }

    /// @notice allow a freelancer to apply for a job.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
    /// @dev add the job id into the freelancer 'appliedJobIds' list.
    /// @dev can only be called by a freelancer.
    /// @dev a freenancer can't apply twice for the same job.
    /// @dev emit a FreelancerApplied event.
    function applyForJob(uint _jobId) 
        public 
        onlyRole(FREELANCER_ROLE) 
        jobChecked(_jobId, JobStatus.OPEN) 
    {
        for (uint i = 0; i < freelancers[msg.sender].appliedJobIds.length; i++) {
            if (freelancers[msg.sender].appliedJobIds[i] == _jobId) {
                revert NotAuthorized("You already applied for this job");
            }
        }
        if (jobs[_jobId].nbCandidates >= LIMIT_CANDIDATES) {
            revert NotAuthorized("This job has already enough candidates");
        }

        freelancers[msg.sender].appliedJobIds.push(_jobId);
        jobs[_jobId].candidatesIds[jobs[_jobId].nbCandidates] = msg.sender;
        emit FreelancerApplied(msg.sender, block.timestamp);
    }

    /// @notice allow a freelancer to confirm his candidature for a job.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
    /// @dev add the job id into the freelancer 'appliedJobIds' list.
    /// @dev can only be called by a freelancer.
    /// @dev candidature can't be confirmed if another freelance already confirmed for the job.
    /// @dev candidature can't be confirmed if the employer doesn't have enough PHARM tokens.
    /// @dev update the job 'freelancerId' attribute.
    /// @dev update the job status to IN_PROGRESS.
    /// @dev remove the job id from the freelancer 'appliedJobIds' list if it's in.
    /// @dev add the job id into the freelancer 'hiredJobIds' list.
    /// @dev emit a FreelancerConfirmedCandidature event.
    function confirmCandidature(uint _jobId) 
        public 
        onlyRole(FREELANCER_ROLE) 
        jobChecked(_jobId, JobStatus.CONFIRMATION_PENDING) 
    {
        if (jobs[_jobId].freelancerAddress != address(0)) {
            revert NotAuthorized("Another freelancer already confirmed for this job");
        }

        address employerAddress = jobs[_jobId].employerAddress;
        if (tokenPHARM.balanceOf(employerAddress) < jobs[_jobId].salary) {
            revert NotAuthorized("Employer doesn't have enough PHARM tokens");
        }

        jobs[_jobId].freelancerAddress = msg.sender;
        jobs[_jobId].status = JobStatus.IN_PROGRESS;
        freelancers[msg.sender].hiredJobIds.push(_jobId);
        freelancers[msg.sender].appliedJobIds = removeJobIdFromArray(_jobId, freelancers[msg.sender].appliedJobIds);
        emit FreelancerConfirmedCandidature(msg.sender, block.timestamp);
    }

    /// @notice allow a freelancer to indicate a job as completed.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
    /// @dev emit a FreelancerCompletedJob event.
    function completeFreelancerJob(uint _jobId) 
        public 
        onlyRole(FREELANCER_ROLE) 
        jobChecked(_jobId, JobStatus.IN_PROGRESS)
        freelancerChecked(_jobId)
    {
        jobs[_jobId].completedByFreelancer = true;
        jobs[_jobId].status = JobStatus.COMPLETED;
        emit FreelancerCompletedJob(msg.sender, _jobId, block.timestamp);
    }

    /// @notice allow a freelancer to claim his salary if the employer didn't confirmed the job.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
    /// @dev a freelancer can only be paied once a job is ended.
    /// @dev will call the payFreelancer function.
    /// @dev - if the employer didn't confirmed the job two days after the job's end date.
    /// @dev - if the freelance confirmed the job and claims his salary.
    /// @dev emit a FreelancerClaimedSalary event.
    function claimSalary(uint _jobId) 
        public 
        onlyRole(FREELANCER_ROLE) 
        jobChecked(_jobId, JobStatus.COMPLETED)
        freelancerChecked(_jobId)
    {
        _payFreelancer(_jobId);
        emit FreelancerClaimedSalary(msg.sender, _jobId, block.timestamp);
    }


    /// Employers

    /// @notice create a new employer.
    /// @dev function called at the first registration of the employer.
    /// @dev emit a EmployerCreated event.
    function createEmployer() public {
        if (hasRole(EMPLOYER_ROLE, msg.sender)) {
            revert AlreadyRegistered();
        }
        _setupRole(EMPLOYER_ROLE, msg.sender);

        employers[msg.sender] = Employer(
            block.timestamp,
            block.timestamp,
            "",
            false,
            new uint[](0),
            new uint[](0)
        );
        employerCount.increment();
        _employersAddresses.push(msg.sender);
        emit EmployerCreated(msg.sender, block.timestamp);
    }

    /// @notice fetch an employer.
    /// @param _id, the id of the freelancer.
    /// @return Employer, a representation of the selected frelancer.
    function getOneEmployer(uint _id) public view returns(Employer memory) {
        if (_id > employerCount.current()) {
            revert EmployerNotExists();
        }
        return employers[_employersAddresses[_id]];
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
    /// @dev can only be called by an employer.
    /// @dev emit a EmployerUpdated event.
    function setEmployer(
        address employerAddress,
        string calldata _name,
        bool _visible
    ) public onlyRole(EMPLOYER_ROLE) {
        if(employers[employerAddress].created_at == 0) {
            revert EmployerNotExists();
        }
        
        employers[employerAddress].name = _name;
        employers[employerAddress].visible = _visible;
        employers[employerAddress].updated_at = block.timestamp;
        emit EmployerUpdated(employerAddress,_name, _visible, block.timestamp);
    }

    /// @notice allow an employer to create a new job.
    /// @param _startDate the new job start date.
    /// @param _endDate the new job enddate.
    /// @param _salary the new job average daily rate.
    /// @param _location the new job location.
    /// @dev can only be called by an employer.
    /// @dev the employer must have enough PHARM tokens.
    /// @dev emit a JobCreated event.
    function createJob(
        uint _startDate,
        uint _endDate,
        uint _salary,
        string calldata _location
    ) public onlyRole(EMPLOYER_ROLE) {
        
        if (tokenPHARM.balanceOf(msg.sender) < _salary) {
            revert NotAuthorized("Employer doesn't have enough PHARM tokens");
        }

        uint jobId = jobCount.current();
        jobs[jobId] = Job(
            _startDate,
            _endDate,
            _salary,
            0,
            true,
            false,
            false,
            new address[](0),
            address(0),
            msg.sender,
            _location,
            JobStatus.OPEN
        );

        jobCount.increment();
        emit JobCreated(
            jobId, 
            msg.sender, 
            _startDate, 
            _endDate,
            _salary, 
            _location, 
            block.timestamp
        );
    }

    /// @notice allow an employer to modify the attributes of a given job.
    /// @param _jobId the job' id.
    /// @param _salary the potential new job salary.
    /// @param _endDate the potential new job end time.
    /// @param _location the potential new job location.
    /// @param _startDate the potential new start time.
    /// @dev can only be called by an employer.
    /// @dev can't be called once a freelance has confirmed.
    /// @dev emit a JobUpdated event.
    function setJob(
        uint _jobId,
        uint _salary,
        uint _startDate,
        uint _endDate,
        string calldata _location
    ) 
        public 
        onlyRole(EMPLOYER_ROLE) 
        employerChecked(_jobId) 
        jobChecked(_jobId, JobStatus.OPEN) 
    {
        jobs[_jobId].salary = _salary;
        jobs[_jobId].startDate = _startDate;
        jobs[_jobId].endDate = _endDate;
        jobs[_jobId].location = _location;

        emit JobUpdated(
            _jobId,
            _salary,
            _startDate,
            _endDate,
            _location,
            block.timestamp
        );
        
    }

    /// @notice allow an employer to hire a freelancer.
    /// @param freelancerAddress the freelancer address.
    /// @param _jobId the job id.
    /// @dev can only be called by an employer.
    /// @dev can't be called once the job has started.
    /// @dev define the job's freelancerAddress
    function hireFreelancer(address freelancerAddress, uint _jobId) 
        public 
        onlyRole(EMPLOYER_ROLE) 
        employerChecked(_jobId) 
        jobChecked(_jobId, JobStatus.OPEN) 
    {
        jobs[_jobId].freelancerAddress = freelancerAddress;
        jobs[_jobId].status = JobStatus.CONFIRMATION_PENDING;
    }

    /// @notice allow an employer to indicate a job as completed.
    /// @param _jobId the job id.
    /// @dev can only be called by an employer freelancer.
    /// @dev call '_payFreelancer()' fuction.
    /// @dev define the job's status as completed.
    /// @dev remove the job id from the freelancer 'hiredJobIds' list.
    /// @dev add the job id into the freelancer 'completedJobIds'.
    /// @dev emit a EmployerCompletedJob event.
    function completeEmployerJob(uint _jobId) 
        public 
        onlyRole(EMPLOYER_ROLE) 
        employerChecked(_jobId) 
        jobChecked(_jobId, JobStatus.IN_PROGRESS)
    {
        _payFreelancer(_jobId);
        jobs[_jobId].status = JobStatus.COMPLETED;
        freelancers[msg.sender].completedJobIds.push(_jobId);
        freelancers[msg.sender].hiredJobIds = removeJobIdFromArray(_jobId, freelancers[msg.sender].appliedJobIds);
        emit EmployerCompletedJob(msg.sender, _jobId, block.timestamp);
    }

    /// @notice pay the freelancer.
    /// @param _jobId the job id.
    /// @dev can only be called by the function completeEmployerJob().
    /// @dev can't be called once the job has started.
    /// @dev update the job 'paid' attribute.
    /// @dev emit a FreelancerPaid event.
    function _payFreelancer(uint _jobId) private {
        tokenPHARM.transferFrom(
            jobs[_jobId].employerAddress,
            jobs[_jobId].freelancerAddress,
            jobs[_jobId].salary
        );
        jobs[_jobId].status = JobStatus.PAID;
        emit FreelancerPaid(jobs[_jobId].freelancerAddress, _jobId, block.timestamp);
    }


    /* :::::::::: UTILS :::::::::: */
    function removeJobIdFromArray(uint _jobId, uint[] memory _array) private pure returns(uint[] memory) {
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
}   



/* Todos 

::::::::::::::: STATE :::::::::::::::::: 

define: 
  skills
  areas
  rewards


Gestion de pay 
--> acounting
--> payement
--> method (hire / complete / pay)

*/