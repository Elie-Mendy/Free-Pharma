
# **DataStorage.sol**
```js
  DataStorage - storage smart contract
    Deployment
      ✔ should set the right owner
      ✔ should set the right PHARM token address
      ✔ should be deployed without any job
      ✔ should be deployed without any freelancer
      ✔ should be deployed without any employer
    Admin Function unit tests
      setBusinessLogicContract()
        ✔ should set the business logic contract address
        ✔ should only allow the owner to set the business logic contract address
    Function unit tests
      Entities - creation and data fetching
        Freelancers functions
          createFreelancer()
            ✔ should create a freelancer
            ✔ should create a freelancer with right values
          getFreelancer()
            ✔ should get the right freelancer (68ms)
          getFreelancers()
            ✔ should get all freelancers (63ms)
          getFreelancerJobApplied()
            ✔ should get all jobs applied by a freelancer (72ms)
          setFreelancer()
            ✔ should update the freelancer with the right values
        Employers functions
          createEmployer()
            ✔ should create an employer
            ✔ should create a freelancer with right values
          getEmployer()
            ✔ should get the right employer (48ms)
          getEmployers()
            ✔ should get all freelancers (45ms)
          setEmployer
            ✔ should update the employer with the right values
        Jobs functions
          getJob()
            ✔ should get the right job (88ms)
          getJobs()
            ✔ should get all jobs (69ms)
          setJob()
            ✔ should update the job with the right values (41ms)
          getJobStatus()
            ✔ should get the right job status
          getJobNbCandidates
            ✔ should get the right number of candidates (45ms)
          getJobEmployerAddress
            ✔ should get the right employer address
          getJobFreelancerAddress
            ✔ should get the right freelancer address (57ms)
          getJobSalary()
            ✔ should get the right job salary
          getJobEndDate()
            ✔ should get the right job end date (39ms)
      Hiring / Payment - prosess functions
        Freelancers functions
          applyForJob()
            ✔ should allow a freelancer to apply for a job
          confirmCandidature()
            ✔ should add the job id into the employer completed startedJobOffersIds list
            ✔ should modify the job status to IN_PROGRESS (38ms)
          completeFreelancerJob()
            ✔ should modify the job status to COMPLETED (44ms)
          processClaim()
            ✔ should update the 'claimed' job attribute to true (56ms)
            ✔ should add the job id into the freelancer completed completedJobIds list (51ms)
        Employers functions
          hireFreelancer
            ✔ should modify the job status to CANDIDATURE_PENDING
            ✔ should add the job id into the freelancer hiredJobIds list
          completeEmployerJob
            ✔ should note the job as completed by employer (45ms)
            ✔ should modify the job status to COMPLETED (48ms)
            ✔ should add the job id into the freelancer completedJobIds list (56ms)
          payFreelancer
            ✔ should modify the job status to PAID (79ms)
            ✔ should transfer the salary to the freelancer (48ms)
      Helpers functions
        getJobCount()
          ✔ should return the number of jobs (57ms)
        getFreelancerCount()
          ✔ should return the right number of freelancers (39ms)
        getEmployerCount()
          ✔ should return the right number of employers
        freelancerAppliedToJob()
          ✔ should return true if the freelancer applied to the job (47ms)
          ✔ should return false if the freelancer didn't applied to the job (45ms)

```
# **FreePharma.sol** 
```js
  FreePharma - business logic smart contract
    Deployment
      ✔ should be deployed with the right admin
    Function unit tests
      Entities - creation and data fetching
        Freelancers functions
          createFreelancer()
            ✔ should allow a freelancer to register
            ✔ should register a freelancer with the right data (39ms)
            ✔ should emit a FreelancerCreated event
            ✔ should forbid a freelancer registration if already registered
          getOneFreelancer()
            ✔ should get a freelancer with the right data
            ✔ should not return a freelancer that does not exist
          getFreelancers()
            ✔ should get the right number of freelancers (99ms)
            ✔ should get all freelancers (84ms)
          setFreelancer()
            ✔ should allow a freelancer to update his data (54ms)
            ✔ should update a freelancer with the right data (54ms)
            ✔ should emit a FreelancerUpdated event (56ms)
            ✔ should forbid a freelancer to update data if not registered (42ms)
        Employers functions
          createEmployer()
            ✔ should allow an employer to register
            ✔ should register an employer with the right data
            ✔ should emit an EmployerCreated event
            ✔ should forbid an employer to register if already registered
          getOneEmployer()
            ✔ should get an employer with the right data
            ✔ should not get an employer that does not exist
          getEmployers()
            ✔ should get the right number of freelancers (76ms)
            ✔ should get all freelancers (75ms)
          setEmployer()
            ✔ should allow an employer to update data (43ms)
            ✔ should update an employer with the right data (42ms)
            ✔ should emit an EmployerUpdated event
            ✔ should forbid an employer to update data if not registered
        Jobs functions
          createJob()
            ✔ should allow an employer to create a job (38ms)
            ✔ should create a job with the right data
            ✔ should emit a JobCreated event
            ✔ should forbid an employer to create a job if he does not have enough found to pay the freelancer
            ✔ should forbid an freelancer to create a job (44ms)
            ✔ should forbid an unregistered account to create a job
          getOneJob()
            ✔ should get a job with the right data (38ms)
            ✔ should not get a job that does not exist
          getJobs()
            ✔ should get all jobs (86ms)
          setJob()
            ✔ should allow an employer to update one his job's data (51ms)
            ✔ should update a job with the right data (50ms)
            ✔ should emit a JobUpdated event (39ms)
            ✔ should forbid an employer to update a job that does not exist
            ✔ should forbid an employer to update a job that is not his (49ms)
            ✔ should forbid a freelancer to update a job (75ms)
            ✔ should forbid an unknown account to update a job (62ms)
      Hiring / Payment - prosess functions
        Freelancers functions
          applyForJob()
            ✔ should allow a freelancer to apply for a job (47ms)
            ✔ should emit a JobApplied event
            ✔ should forbid a freelancer to apply for a job that does not exist
            ✔ should forbid a freelancer to apply for a job if he already applied
            ✔ should forbid a freelancer to apply for a job that is already provided
            ✔ should forbid an employer  to apply for a job
            ✔ should forbid an unknown account to apply for a job
          confirmCandidature()
            ✔ should allow a freelancer to confirm his candidature (83ms)
            ✔ should emit a FreelancerConfirmedCandidature event (49ms)
            ✔ should forbid a freelancer to confirm his candidature if another freelancer was hired (49ms)
            ✔ should forbid a freelancer to confirm his candidature if he was not hired (47ms)
            ✔ should forbid a freelancer to confirm his candidature for a job that does not exist
            ✔ should forbid a freelancer to confirm his candidature if the employer does not have enough found to pay him (74ms)
            ✔ should forbid an employer to confirm a candidature as a freelancer
            ✔ should forbid an unknown account to confirm a candidature as a freelancer
          completeFreelancerJob()
            ✔ should allow a freelancer to complete a job (65ms)
            ✔ should emit a FreelancerCompletedJob event (53ms)
            ✔ should forbid a freelancer to complete a job if he was not hired (47ms)
            ✔ should forbid a freelancer to complete a job that does not exist
            ✔ should forbid an employer to complete a job as a freelancer
            ✔ should forbid an unknown account to complete a job as a freelancer
          claimSalary()
            ✔ should allow a freelancer to claim his salary (116ms)
            ✔ should emit a FreelancerClaimedSalary event (75ms)
            ✔ should forbid a freelancer to claim his salary if he was not hired (76ms)
            ✔ should forbid a freelancer to claim his salary if the job is not completed (63ms)
            ✔ should forbid a freelancer to claim a salary for a job that does not exist
            ✔ should forbid an employer to claim a salary as a freelancer
            ✔ should forbid an unknown account to claim a salary as a freelancer
        Employers functions
          hireFreelancer()
            ✔ should allow an employer to hire a freelancer (56ms)
            ✔ should allow an employer to send hire invitation for several freelancers (77ms)
            ✔ should emit a FreelancerHired event
            ✔ should forbid an employer to hire a freelancer if he is not the owner of the job
            ✔ should forbid an employer to hire a freelancer if the job does not exist
            ✔ should forbid an employer to hire a freelancer if the freelancer does not exist
            ✔ should forbid a freelancer to call that function (44ms)
            ✔ should forbid an unknown account to call that function (39ms)
          completeEmployerJob()
            ✔ should allow an employer to complete his job (73ms)
            ✔ should emit a EmployerCompletedJob event (66ms)
            ✔ should forbid an employer to complete a job if he is not the owner of the job (73ms)
            ✔ should forbid an employer to complete a job if the job does not exist
            ✔ should forbid a freelancer to call that function (96ms)
            ✔ should forbid an unknown account to call that function (92ms)
    Integration test
      ✔ should allow an employer registration
      ✔ should allow an employer to create a job
      ✔ should allow a freelancer registration
      ✔ should allow a freelancer to apply for a job
      ✔ should allow an employer to hire a applicant
      ✔ should allow a freelancer to confirm his candidature (39ms)
      ✔ should allow a freelancer to indicate the job as completed
      ✔ should allow an employer to indicate the job as completed
      ✔ should have updated data
```

# **TokenPHARM.sol**
```js
  TokenPHARM
    ✔ Should have correct name, symbol, and initial supply
    ✔ Should grant roles to the deployer
    ✔ Should mint tokens
    ✔ Should not allow minting tokens by non-minter

  PriceProvider
    Deployment
      getLatestPriceETH()
        ✔ Should be deployed with the right owner
    Function unit tests
      getLatestPriceETH()
        ✔ Should return the latest price of ETH in USD
      dataFeedETH()
        ✔ Should return the dataFeed's address
```

# **StakingManager.sol**
```js
 StakingManager
    Deployment
      ✔ should have the minter role
      ✔ should be deployed without value stacked
      ✔ should be deployed in production mode
    Function unit tests
      Staking
        stakePHARM()
          ✔ should allow a user to stake PHARM tokens
          ✔ should update the PHARMtotalValueLocked
          ✔ should not update the user's reward at the first staking
          ✔ should update the user's reward if required time has passed since the last update (50ms)
          ✔ should forbid a user to stake an unsuficient amount of PHARM tokens
          ✔ should forbid a user to stake more PHARM tokens than he has
          ✔ should forbid a user to stake more PHARM tokens than he allowed the contract to transfer
          ✔ should emit a StakePHARM event
        stakeETH()
          ✔ should allow a user to stake ETH tokens
          ✔ should update the ETHtotalValueLocked
          ✔ should not update the user's reward at the first staking
          ✔ should update the user's reward if required time has passed since the last update
          ✔ should forbid a user to stake an unsuficient amount of ETH tokens
          ✔ should emit a StakeETH event
      Unstaking
        unstakePHARM()
          ✔ should allow a user to unstake PHARM tokens
          ✔ should update the PHARMtotalValueLocked
          ✔ should update the user's reward if required time has passed since the last update (49ms)
          ✔ should forbid a user to unstake more PHARM tokens than he has staked
          ✔ should emit a UnstakePHARM event
        unstakeETH()
          ✔ should allow a user to unstake ETH tokens
          ✔ should update the ETHtotalValueLocked
          ✔ should update the user's reward if required time has passed since the last update
          ✔ should forbid a user to unstake more ETH tokens than he has staked
          ✔ should emit a UnstakeETH event
      Rewards
        claimRewards()
          ✔ should allow a user to claim his rewards (44ms)
          ✔ should forbid a user to claim his rewards if he has no rewards
          ✔ should emit a RewardsClaimed event
      Helpers
        DemoMode()
          ✔ should return true
          ✔ should return false
        lastBlockUpdateTime()
          ✔ should return the last block timestamp
        APR()
          ✔ should return the right APR
        ETHprice()
          ✔ should return the right ETH price
        PHARMprice()
          ✔ should return the right PHARM price
        PHARMtotalValueLocked()
          ✔ should return the right PHARM total value locked
        ETHtotalValueLocked()
          ✔ should return the right ETH total value locked
        getTotalStaked()
          ✔ should return the right total staked for only PHARM staked
          ✔ should return the right total staked for only ETH staked
          ✔ should return the right total staked
        getPercentageOfTotalStaked()
          ✔ should return the right percentage of total staked for only PHARM staked (40ms)
          ✔ should return the right percentage of total staked for only ETH staked
          ✔ should return the right percentage of total staked
        getBonusCoefficient()
          ✔ should return no bonus coefficient if percentage TVL < 1%
          ✔ should not return emply values for an unexisting user's data
    Reward Fuzzing
      Production Mode - rewards per year
        ✔ should not update the reward before one day
        ✔ should update the reward after one day
        ✔ should aproximatively rewarding 80 PHARM tokens for 1000 PHARM staked on one year
        ✔ should aproximatively rewarding 40 PHARM tokens for 1000 PHARM staked on six months
        ✔ should aproximatively rewarding 20 PHARM tokens for 1000 PHARM staked on three months (44ms)
        ✔ should aproximatively rewarding 40 PHARM tokens for 500 PHARM staked on one year
        ✔ should aproximatively rewarding 20 PHARM tokens for 500 PHARM staked on six months
        ✔ should aproximatively rewarding 10 PHARM tokens for 500 PHARM staked on three months
        ✔ should aproximatively rewarding 8 PHARM tokens for 100 PHARM staked on one year
        ✔ should aproximatively rewarding 4 PHARM tokens for 100 PHARM staked on six months
        ✔ should aproximatively rewarding 2 PHARM tokens for 100 PHARM staked on three months
        ✔ should aproximatively rewarding 3200 PHARM tokens for 10 ETH staked on one year
        ✔ should aproximatively rewarding 320 PHARM tokens for 1 ETH staked on one year
        ✔ should aproximatively rewarding 32 PHARM tokens for 0.1 ETH staked on one year
        ✔ should aproximatively rewarding 1600 PHARM tokens for 10 ETH staked on six months
        ✔ should aproximatively rewarding 160 PHARM tokens for 1 ETH staked on six months
        ✔ should aproximatively rewarding 16 PHARM tokens for 0.1 ETH staked on six months
        ✔ should aproximatively rewarding 800 PHARM tokens for 10 ETH staked on three months
        ✔ should aproximatively rewarding 80 PHARM tokens for 1 ETH staked on three months
        ✔ should aproximatively rewarding 8 PHARM tokens for 0.1 ETH staked on three months
      Debug Mode - rewards per minute
        ✔ should aproximatively rewarding 80 PHARM tokens for 1000 PHARM staked on one minute
        ✔ should aproximatively rewarding 40 PHARM tokens for 1000 PHARM staked on 30 secondes
        ✔ should aproximatively rewarding 20 PHARM tokens for 1000 PHARM staked on 15 secondes
        ✔ should aproximatively rewarding 40 PHARM tokens for 500 PHARM staked on one minute
        ✔ should aproximatively rewarding 20 PHARM tokens for 500 PHARM staked on 30 secondes
        ✔ should aproximatively rewarding 10 PHARM tokens for 500 PHARM staked on 15 secondes
        ✔ should aproximatively rewarding 8 PHARM tokens for 100 PHARM staked on one minute
        ✔ should aproximatively rewarding 4 PHARM tokens for 100 PHARM staked on 30 secondes
        ✔ should aproximatively rewarding 2 PHARM tokens for 100 PHARM staked on 15 secondes
        ✔ should aproximatively rewarding 3200 PHARM tokens for 10 ETH staked on one minute
        ✔ should aproximatively rewarding 320 PHARM tokens for 1 ETH staked on one minute
        ✔ should aproximatively rewarding 32 PHARM tokens for 0.1 ETH staked on one minute
        ✔ should aproximatively rewarding 1600 PHARM tokens for 10 ETH staked on 30 secondes
        ✔ should aproximatively rewarding 160 PHARM tokens for 1 ETH staked on 30 secondes
        ✔ should aproximatively rewarding 16 PHARM tokens for 0.1 ETH staked on 30 secondes
        ✔ should aproximatively rewarding 800 PHARM tokens for 10 ETH staked on 15 secondes
        ✔ should aproximatively rewarding 80 PHARM tokens for 1 ETH staked on 15 secondes
        ✔ should aproximatively rewarding 8 PHARM tokens for 0.1 ETH staked on 15 secondes
```
