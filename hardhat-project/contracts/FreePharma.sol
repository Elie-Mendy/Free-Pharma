// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IDataStorage.sol";

/**
 * @title FreePharma
 * @author Elie MENDY
 * @notice You can use this contract for only the most educational purpose
 */
contract FreePharma is AccessControl {
    /* ::::::::::::::: ROLES :::::::::::::::::: */

    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");
    bytes32 public constant FREELANCER_ROLE = keccak256("FREELANCER_ROLE");
    

    /* ::::::::::::::: STATE :::::::::::::::::: */

    using Counters for Counters.Counter;

    uint8 public constant LIMIT_CANDIDATES = 200;

    address public admin;
    address[] public admins;
    
    IDataStorage private dataStorage;
    IERC20 public tokenPHARM; // ERC20 PHARM token


    constructor(IDataStorage _dataStorage, address _tokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN, msg.sender);
        admin = msg.sender;
        admins.push(msg.sender);
        dataStorage = _dataStorage;
        tokenPHARM = IERC20(_tokenAddress);
    }


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

    modifier jobChecked(uint jobId, IDataStorage.JobStatus status) {
        if (jobId >  dataStorage.getJobCount()) {
            revert JobNotExists();
        }
        if (dataStorage.getJob(jobId).status != status) {
            revert NotAuthorized("Job status forbid this action");
        }
        _;
    }

    modifier employerChecked(uint jobId) {
        if (dataStorage.getJob(jobId).employerAddress != msg.sender) {
            revert NotAuthorized("You're not the employer of this job");
        }
        _;
    }

    modifier freelancerChecked(uint jobId) {
        if (dataStorage.getJob(jobId).freelancerAddress != msg.sender) {
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
        dataStorage.createFreelancer(msg.sender);
        emit FreelancerCreated(msg.sender, block.timestamp);
    }

    /// @notice fetch all freelancers.
    /// @return Freelancer[], an array of freelancers.
    function getFreelancers() public view returns(IDataStorage.Freelancer[] memory) {
        return dataStorage.getFreelancers();
    }

    /// @notice allow a freelancer to modify his attributes.
    /// @param _name the freelancer's name.
    /// @param _location the freelancer's location.
    /// @param _averageDailyRate the freelancer's average daily rate.
    /// @param _available the freelancer's availablility.
    /// @param _visible the freelancer's visibility.
    /// @dev can only be called by a freelancer.
    /// @dev emit a FreelancerUpdated event.
    function setFreelancer(
        string calldata _name,
        string calldata _location,
        uint _averageDailyRate,
        bool _available,
        bool _visible
    ) public onlyRole(FREELANCER_ROLE)  {
        if (dataStorage.getFreelancer(msg.sender).created_at != 0) {
            revert FreelancerNotExists();
        }
        dataStorage.setFreelancer(
            msg.sender,
            _name,
            _location,
            _averageDailyRate,
            _available,
            _visible
        );
        emit FreelancerUpdated(
            msg.sender, 
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
        jobChecked(_jobId, IDataStorage.JobStatus.OPEN) 
    {   
        IDataStorage.Freelancer memory freelancer = dataStorage.getFreelancer(msg.sender);
        for (uint i = 0; i < freelancer.appliedJobIds.length; i++) {
            if (freelancer.appliedJobIds[i] == _jobId) {
                revert NotAuthorized("You already applied for this job");
            }
        }
        if (dataStorage.getJob(_jobId).nbCandidates >= LIMIT_CANDIDATES) {
            revert NotAuthorized("This job has already enough candidates");
        }

        dataStorage.applyForJob(_jobId, msg.sender);
        emit FreelancerApplied(msg.sender, block.timestamp);
    }

    /// @notice allow a freelancer to confirm his candidature for a job.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
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
        jobChecked(_jobId, IDataStorage.JobStatus.CONFIRMATION_PENDING) 
    {
        if (dataStorage.getJob(_jobId).freelancerAddress != address(0)) {
            revert NotAuthorized("Another freelancer already confirmed for this job");
        }

        address employerAddress = dataStorage.getJob(_jobId).employerAddress;
        if (tokenPHARM.balanceOf(employerAddress) < dataStorage.getJob(_jobId).salary) {
            revert NotAuthorized("Employer doesn't have enough PHARM tokens");
        }

        dataStorage.confirmCandidature(_jobId, msg.sender);
        emit FreelancerConfirmedCandidature(msg.sender, block.timestamp);
    }

    /// @notice allow a freelancer to indicate a job as completed.
    /// @param _jobId the job id.
    /// @dev can only be called by a freelancer.
    /// @dev emit a FreelancerCompletedJob event.
    function completeFreelancerJob(uint _jobId) 
        public 
        onlyRole(FREELANCER_ROLE) 
        jobChecked(_jobId, IDataStorage.JobStatus.IN_PROGRESS)
        freelancerChecked(_jobId)
    {
        dataStorage.completeFreelancerJob(_jobId);
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
        jobChecked(_jobId, IDataStorage.JobStatus.COMPLETED)
        freelancerChecked(_jobId)
    {
        dataStorage.payFreelancer(_jobId);
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
        dataStorage.createEmployer(msg.sender);
        emit EmployerCreated(msg.sender, block.timestamp);
    }

    /// @notice fetch an employer.
    /// @param _employerAddresses, the id of the employer.
    /// @return Employer, a representation of the selected frelancer.
    function getOneEmployer(address _employerAddresses) public view returns(IDataStorage.Employer memory) {
        return dataStorage.getEmployer(_employerAddresses);
    }

    /// @notice fetch all freelancers.
    /// @return Freelancer[], an array of freelancers.
    function getEmployers() public view returns(IDataStorage.Employer[] memory) {
        return dataStorage.getEmployers();
    }

    /// @notice allow an employer to modify his attributes.
    /// @param _employerAddress the employer's address.
    /// @param _name the employer's name.
    /// @param _visible the employer's visibility.
    /// @dev can only be called by an employer.
    /// @dev emit a EmployerUpdated event.
    function setEmployer(
        address _employerAddress,
        string calldata _name,
        bool _visible
    ) public onlyRole(EMPLOYER_ROLE) {
        if(dataStorage.getEmployer(_employerAddress).created_at == 0) {
            revert EmployerNotExists();
        }
        dataStorage.setEmployer(_employerAddress, _name, _visible);
        emit EmployerUpdated(_employerAddress,_name, _visible, block.timestamp);
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
        uint jobId =  dataStorage.getJobCount();
        dataStorage.createJob(
            msg.sender,
            _startDate, 
            _endDate, 
            _salary, 
            _location
        );

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
    /// @param _startDate the potential new start time.
    /// @param _endDate the potential new job end time.
    /// @param _location the potential new job location.
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
        jobChecked(_jobId, IDataStorage.JobStatus.OPEN) 
    {
        dataStorage.setJob(
            _jobId,
            _salary,
            _startDate,
            _endDate,
            _location
        );

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
        jobChecked(_jobId, IDataStorage.JobStatus.OPEN) 
    {
        dataStorage.hireFreelancer(freelancerAddress, _jobId);
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
        jobChecked(_jobId, IDataStorage.JobStatus.IN_PROGRESS)
    {
        dataStorage.payFreelancer(_jobId);
        dataStorage.completeEmployerJob(_jobId);
        emit EmployerCompletedJob(msg.sender, _jobId, block.timestamp);
    }



}