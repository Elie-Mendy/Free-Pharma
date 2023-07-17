const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test FreePharma - business logic smart contract", function () {
    let tokenPHARM, dataStorage, freePharma;
    let admin, addr1, addr2, addr3, addr4, unknown, addresses;

    // stock a startDate and an endDate
    let startDate = new Date(2023, 0, 1); // January 1, 2023
    let endDate = new Date(2023, 1, 1); // January 1, 2023
    
    // convert them to timestamp
    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
    let salary = 5000
    let location = "Paris"

    // stock a new startDate and a new endDate
    let newStartDate = new Date(2023, 5, 1); // January 5, 2023
    let newEndDate = new Date(2023, 6, 1); // January 6, 2023
    
    // convert them to timestamp
    let newStartDateTimestamp = Math.floor(newStartDate.getTime() / 1000);
    let newEndDateTimestamp = Math.floor(newEndDate.getTime() / 1000);
    let newSalary = 500
    let newLocation = "Toulouse"



    context("Deployment", function () {
        // Contracts deployment
        before(async function () {
            // fetch accounts once, instanciation of all those variables
            [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
                await ethers.getSigners();

            // PHARM token deployment
            let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
            tokenPHARM = await TokenPHARM.deploy();

            // DataStorage deployment
            let DataStorage = await hre.ethers.getContractFactory("DataStorage");
            dataStorage = await DataStorage.deploy(tokenPHARM.address);

            // FreePharma deployment
            let FreePharma = await hre.ethers.getContractFactory("FreePharma");
            freePharma = await FreePharma.deploy(
                dataStorage.address,
                tokenPHARM.address
            );
        });

        it("should be deployed with the right admin", async function () {
            let contractDefaultAdmin = await freePharma.admin();
            assert.equal(contractDefaultAdmin, admin.address);
        });
    });


    context("Function unit tests", function () {
        // Contracts deployment
        before(async function () {
            
            // fetch accounts once, instanciation of all those variables
            [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
                await ethers.getSigners();

            // PHARM token deployment
            let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
            tokenPHARM = await TokenPHARM.deploy();
        });
        
        context("Entities - creation and data fetching", function () {
            // Contracts deployment
            beforeEach(async function () {
                // DataStorage deployment
                let DataStorage = await hre.ethers.getContractFactory("DataStorage");
                dataStorage = await DataStorage.deploy(tokenPHARM.address);

                // FreePharma deployment
                let FreePharma = await hre.ethers.getContractFactory("FreePharma");
                freePharma = await FreePharma.deploy(
                    dataStorage.address,
                    tokenPHARM.address
                );

                // PHARM token minting
                await tokenPHARM.mint(admin.address, 100000);
                await tokenPHARM.mint(addr1.address, 100000);
                await tokenPHARM.connect(addr1).approve(dataStorage.address, 100000);
            });

            describe("Freelancers functions", function () {
                
                describe("createFreelancer()", function () {
                    it("should allow a freelancer to register", async function () {
                        let freelancerCount = await dataStorage.getFreelancerCount();
                        assert.equal(freelancerCount.toString(), '0');

                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );

                        freelancerCount = await dataStorage.getFreelancerCount();
                        assert.equal(freelancerCount.toString(), '1');
                    });

                    it("should register a freelancer with the right data", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );

                        let freelancer = await dataStorage.connect(addr2).getFreelancer(addr2.address);
                        assert.equal(freelancer.name, "John");
                        assert.equal(freelancer.email, "test@example.com");
                        assert.equal(freelancer.location, "Paris");
                        assert.equal(freelancer.averageDailyRate, 250);
                        assert.equal(freelancer.available, true);
                        assert.equal(freelancer.visible, true);
                    });

                    it("should emit a FreelancerCreated event", async function () {
                        await expect(await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true ))
                            .to.emit(freePharma,"FreelancerCreated")
                    });

                    it("should forbid a freelancer registration if already registered", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );
                        await expect(freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true ))
                            .to.be.revertedWithCustomError(freePharma,"AlreadyRegistered");
                    });  
                });

                describe("getOneFreelancer()", function () {
                    it("should get a freelancer with the right data", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );

                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        assert.equal(freelancer.name, "John");
                        assert.equal(freelancer.email, "test@example.com");
                        assert.equal(freelancer.location, "Paris");
                        assert.equal(freelancer.averageDailyRate, 250);
                        assert.equal(freelancer.available, true);
                        assert.equal(freelancer.visible, true);
                    });

                    it("should not return a freelancer that does not exist", async function () {
                        await expect(freePharma.connect(addr2).getOneFreelancer(addr2.address))
                            .to.be.revertedWithCustomError(freePharma,"FreelancerNotExists");
                    });
                });

                describe("getFreelancers()", function () {
                    it("should get the right number of freelancers", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                        await freePharma.connect(addr3).createFreelancer("Jane", "jane@example.com", "Lyon", 350, false, true );
                        await freePharma.connect(addr4).createFreelancer("Joe", "joe@example.com", "Marseille", 450, false, false );
                        
                        let freelancerCount = await dataStorage.getFreelancerCount();
                        assert.equal(freelancerCount.toString(), '3');

                        let freelancers = await freePharma.getFreelancers();
                        assert.equal(freelancers.length, 3);
                    });

                    it("should get all freelancers", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                        await freePharma.connect(addr3).createFreelancer("Jane", "jane@example.com", "Lyon", 350, false, true );
                        await freePharma.connect(addr4).createFreelancer("Joe", "joe@example.com", "Marseille", 450, false, false );
                        
                        let freelancers = await freePharma.getFreelancers();
                        assert.equal(freelancers[0].name, "John");
                        assert.equal(freelancers[1].name, "Jane");
                        assert.equal(freelancers[2].name, "Joe");
                    });
                });

                describe("setFreelancer()", function () {
                    it("should allow a freelancer to update his data", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                        await freePharma.connect(addr2).setFreelancer("Jane", "jane@exemple.com", "Lyon", 350, false, true );

                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        assert.notEqual(freelancer.created_at, freelancer.updated_at);
                    });

                    it("should update a freelancer with the right data", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                        await freePharma.connect(addr2).setFreelancer("Jane", "jane@example.com", "Lyon", 350, false, true );

                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        assert.equal(freelancer.name, "Jane");
                        assert.equal(freelancer.email, "jane@example.com");
                        assert.equal(freelancer.location, "Lyon");
                        assert.equal(freelancer.averageDailyRate, 350);
                        assert.equal(freelancer.available, false);
                        assert.equal(freelancer.visible, true);
                    });

                    it("should emit a FreelancerUpdated event", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                        await expect(await freePharma.connect(addr2).setFreelancer("Jane", "jane@exemple.com", "Lyon", 350, false, true ))
                            .to.emit(freePharma,"FreelancerUpdated")
                    });

                    it("should forbid a freelancer to update data if not registered", async function () {
                        await expect(freePharma.connect(addr2).setFreelancer("Jane", "jane@exemple.com", "Lyon", 350, false, true ))
                            .to.be.reverted;
                    });
                });

            });

            describe("Employers functions", function () {

                describe("createEmployer()", function () {
                    it("should allow an employer to register", async function () {
                        let employerCount = await dataStorage.getEmployerCount();
                        assert.equal(employerCount.toString(), '0');

                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );

                        freelancerCount = await dataStorage.getEmployerCount();
                        assert.equal(freelancerCount.toString(), '1');
                    });

                    it("should register an employer with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );

                        let employer = await dataStorage.connect(addr2).getEmployer(addr1.address);
                        assert.equal(employer.name, "Sanofi");
                        assert.equal(employer.email, "sanofi@example.com");
                        assert.equal(employer.visible, true);
                    });

                    it("should emit an EmployerCreated event", async function () {
                        await expect(await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true ))
                            .to.emit(freePharma,"EmployerCreated")
                    });

                    it("should forbid an employer to register if already registered", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await expect(freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true ))
                            .to.be.revertedWithCustomError(freePharma,"AlreadyRegistered");
                    });
                });

                describe("getOneEmployer()", function () {
                    it("should get an employer with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );

                        let employer = await freePharma.connect(addr1).getOneEmployer(addr1.address);
                        assert.equal(employer.name, "Sanofi");
                        assert.equal(employer.email, "sanofi@example.com");
                        assert.equal(employer.visible, true);
                    });

                    it("should not get an employer that does not exist", async function () {
                        await expect(freePharma.connect(addr2).getOneEmployer(addr2.address))
                            .to.be.revertedWithCustomError(freePharma,"EmployerNotExists");
                    });
                });

                describe("getEmployers()", function () {
                    it("should get the right number of freelancers", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr2).createEmployer("Pfizer", "pfizer@example.com", true );
                        await freePharma.connect(addr3).createEmployer("Boiron", "boiron@example.com", true );
 
                        let employerCount = await dataStorage.getEmployerCount();
                        assert.equal(employerCount.toString(), '3');

                        let employers = await freePharma.getEmployers();
                        assert.equal(employers.length, 3);
                    });

                    it("should get all freelancers", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr2).createEmployer("Pfizer", "pfizer@example.com", true );
                        await freePharma.connect(addr3).createEmployer("Boiron", "boiron@example.com", true );

                        let employers = await freePharma.getEmployers();
                        assert.equal(employers[0].name, "Sanofi");
                        assert.equal(employers[1].name, "Pfizer");
                        assert.equal(employers[2].name, "Boiron");
                    });
                });

                describe("setEmployer()", function () {
                    it("should allow an employer to update data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).setEmployer("Pfizer", "pfizer@example.com", true );

                        let employer = await freePharma.connect(addr1).getOneEmployer(addr1.address);
                        assert.notEqual(employer.created_at, employer.updated_at);
                    });

                    it("should update an employer with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).setEmployer("Pfizer", "pfizer@example.com", true );

                        let employer = await freePharma.connect(addr1).getOneEmployer(addr1.address);
                        assert.equal(employer.name, "Pfizer");
                        assert.equal(employer.email, "pfizer@example.com");
                        assert.equal(employer.visible, true);
                    });

                    it("should emit an EmployerUpdated event", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true);
                        await expect(await freePharma.connect(addr1).setEmployer("Pfizer", "pfizer@example.com", true ))
                            .to.emit(freePharma,"EmployerUpdated")
                    });
                    
                    it("should forbid an employer to update data if not registered", async function () {
                        await expect(freePharma.connect(addr1).setEmployer("Pfizer", "pfizer@example.com", true ))
                            .to.be.reverted;
                    });
                });
                
            });

            describe("Jobs functions", function () {
                
                describe("createJob()", function () {
                    it("should allow an employer to create a job", async function () {
                        let jobCount = await dataStorage.getJobCount();
                        assert.equal(jobCount.toString(), '0');
                        
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);

                        jobCount = await dataStorage.getJobCount();
                        assert.equal(jobCount.toString(), '1');
                    });

                    it("should create a job with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);

                        let job = await dataStorage.connect(addr1).getJob(0);
                        assert.equal(job.startDate, startDateTimestamp);
                        assert.equal(job.endDate, endDateTimestamp);
                        assert.equal(job.salary, salary);
                        assert.equal(job.location, location);
                    });

                    it("should emit a JobCreated event", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await expect(await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location))
                            .to.emit(freePharma,"JobCreated")
                    });

                    it("should forbid an employer to create a job if he does not have enough found to pay the freelancer", async function () {
                        await freePharma.connect(addr4).createEmployer("noFundLab", "poor@example.com", true );
                        
                        await expect(freePharma.connect(addr4).createJob(startDateTimestamp, endDateTimestamp, salary, location))
                            .to.be.revertedWithCustomError(freePharma,"EmployerHasNotEnoughFunds")
                    });

                    it("should forbid an freelancer to create a job", async function () {
                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );
                        await expect(freePharma.connect(addr2).createJob(startDateTimestamp, endDateTimestamp, salary, location))
                            .to.be.reverted;
                    });

                    it("should forbid an unregistered account to create a job", async function () {
                        await expect(freePharma.connect(unknown).createJob(startDateTimestamp, endDateTimestamp, salary, location))
                            .to.be.reverted;
                    });
                });

                describe("getOneJob()", function () {
                    it("should get a job with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);

                        let job = await freePharma.connect(addr1).getOneJob(0);
                        assert.equal(job.startDate, startDateTimestamp);
                        assert.equal(job.endDate, endDateTimestamp);
                        assert.equal(job.salary, salary);
                        assert.equal(job.location, location);
                    });

                    it("should not get a job that does not exist", async function () {
                        await expect(freePharma.connect(addr1).getOneJob(10))
                            .to.be.revertedWithCustomError(freePharma,"JobNotExists");
                    });
                });

                describe("setJob()", function () {
                    it("should allow an employer to update one his job's data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        await freePharma.connect(addr1).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation);

                        let job = await freePharma.connect(addr1).getOneJob(0);
                        assert.notEqual(job.salary, job.newSalary);
                    });

                    it("should update a job with the right data", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        await freePharma.connect(addr1).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation);

                        let job = await freePharma.connect(addr1).getOneJob(0);
                        assert.equal(job.startDate, newStartDateTimestamp);
                        assert.equal(job.endDate, newEndDateTimestamp);
                        assert.equal(job.salary, newSalary);
                        assert.equal(job.location, newLocation);
                    });

                    it("should emit a JobUpdated event", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        await expect(await freePharma.connect(addr1).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation))
                            .to.emit(freePharma,"JobUpdated")
                    });

                    it("should forbid an employer to update a job that does not exist", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        
                        await expect(freePharma.connect(addr1).setJob(1, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation))
                            .to.be.revertedWithCustomError(freePharma,"NotAuthorized");
                    });

                    it("should forbid an employer to update a job that is not his", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr2).createEmployer("Pfizer", "pfizer@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        
                        await expect(freePharma.connect(addr2).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation))
                            .to.be.revertedWithCustomError(freePharma,"NotAuthorized");
                    });

                    it("should forbid a freelancer to update a job", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );
                        
                        await expect(freePharma.connect(addr2).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to update a job", async function () {
                        await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                        await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        
                        await expect(freePharma.connect(unknown).setJob(0, newSalary, newStartDateTimestamp, newEndDateTimestamp, newLocation))
                            .to.be.reverted;
                    });
                });
            });

            
        });
        
        context("Hiring / Payment - prosess functions", async () => {

            // Contracts deployment
            beforeEach(async function () {
                // fetch accounts once, instanciation of all those variables
                [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
                await ethers.getSigners();

                // PHARM token deployment
                let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
                tokenPHARM = await TokenPHARM.deploy();

                // DataStorage deployment
                let DataStorage = await hre.ethers.getContractFactory("DataStorage");
                dataStorage = await DataStorage.deploy(tokenPHARM.address);

                // FreePharma deployment
                let FreePharma = await hre.ethers.getContractFactory("FreePharma");
                freePharma = await FreePharma.deploy(
                    dataStorage.address,
                    tokenPHARM.address
                );

                // PHARM token minting
                await tokenPHARM.mint(admin.address, 100000);
                await tokenPHARM.mint(addr1.address, 100000);
                await tokenPHARM.mint(addr4.address, 5000);
                await tokenPHARM.connect(addr1).approve(dataStorage.address, 100000);

                // Data preparation for testing
                await freePharma.connect(addr1).createEmployer("Sanofi", "sanofi@example.com", true );
                await freePharma.connect(addr1).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                await freePharma.connect(addr2).createFreelancer("John", "john@example.com", "Paris", 250, true, true );
                await freePharma.connect(addr3).createFreelancer("Jane", "jane@example.com", "Toulouse", 250, true, true );
            });
            
            describe("Freelancers functions", function () {
                
                describe("applyForJob()", function () {
                    it("should allow a freelancer to apply for a job", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        
                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        let job = await freePharma.connect(addr2).getOneJob(0);

                        assert.equal(freelancer.appliedJobIds.length, 1);
                        assert.equal(freelancer.appliedJobIds[0].toString(), 0);
                        assert.equal(job.candidates.length, 1);
                        assert.equal(job.candidates[0], addr2.address);
                    });

                    it("should emit a JobApplied event", async function () {
                        await expect(await freePharma.connect(addr2).applyForJob(0))
                            .to.emit(freePharma,"FreelancerApplied")
                    });

                    it("should forbid a freelancer to apply for a job that does not exist", async function () {
                        await expect(freePharma.connect(addr2).applyForJob(1))
                            .to.be.revertedWithCustomError(freePharma,"JobNotExists");
                    });

                    it("should forbid a freelancer to apply for a job if he already applied", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(addr2).applyForJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to apply for a job that is already provided", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);

                        await expect(freePharma.connect(addr3).applyForJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid an employer  to apply for a job", async function () {
                        await expect(freePharma.connect(addr1).applyForJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to apply for a job", async function () {
                        await expect(freePharma.connect(unknown).applyForJob(0))
                            .to.be.reverted;
                    });
                });

                describe("confirmCandidature()", function () {

                    it("should allow a freelancer to confirm his candidature", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);

                        let employer = await freePharma.connect(addr1).getOneEmployer(addr1.address);
                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        let job = await freePharma.connect(addr2).getOneJob(0);

                        assert.equal(employer.currentJobOffersIds.length, 0);
                        assert.equal(employer.startedJobOffersIds.length, 1);
                        assert.equal(employer.startedJobOffersIds[0].toString(), 0);
                        assert.equal(employer.completedJobOffersIds.length, 0);

                        assert.equal(freelancer.hiredJobIds.length, 1);
                        assert.equal(freelancer.hiredJobIds[0].toString(), 0);

                        assert.equal(job.candidates.length, 1);
                        assert.equal(job.candidates[0], addr2.address);
                        assert.equal(job.freelancerAddress, addr2.address);
                    });

                    it("should emit a FreelancerConfirmedCandidature event", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        
                        await expect(await freePharma.connect(addr2).confirmCandidature(0))
                            .to.emit(freePharma,"FreelancerConfirmedCandidature")
                    });

                    it("should forbid a freelancer to confirm his candidature if another freelancer was hired", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await expect(freePharma.connect(addr3).confirmCandidature(0))
                            .to.be.revertedWithCustomError(freePharma, 'NotAuthorized');
                    });

                    it("should forbid a freelancer to confirm his candidature if he was not hired", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await expect(freePharma.connect(addr3).confirmCandidature(0))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to confirm his candidature for a job that does not exist", async function () {
                        await expect(freePharma.connect(addr3).confirmCandidature(10))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to confirm his candidature if the employer does not have enough found to pay him", async function () {

                        await freePharma.connect(addr4).createEmployer("noFundLab", "poor@example.com", true );
                        await freePharma.connect(addr4).createJob(startDateTimestamp, endDateTimestamp, salary, location);
                        await freePharma.connect(addr2).applyForJob(1);
                        await freePharma.connect(addr4).hireFreelancer(1, addr2.address);
                        // transfer tokens to addr1
                        await tokenPHARM.connect(addr4).transfer(addr1.address, 1000);
                        // now employer has not enough funds to pay freelancer
                        await expect(freePharma.connect(addr3).confirmCandidature(1))
                            .to.be.revertedWithCustomError(freePharma,"EmployerHasNotEnoughFunds")
                    });

                    it("should forbid an employer to confirm a candidature as a freelancer", async function () {
                        await expect(freePharma.connect(addr1).confirmCandidature(0))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to confirm a candidature as a freelancer", async function () {
                        await expect(freePharma.connect(unknown).confirmCandidature(0))
                            .to.be.reverted;
                    });

                });
                
                describe("completeFreelancerJob()", function () {
                    it("should allow a freelancer to complete a job", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await freePharma.connect(addr2).completeFreelancerJob(0);

                        let job = await freePharma.connect(addr2).getOneJob(0);
                       
                        assert.equal(job.freelancerAddress, addr2.address);
                        assert.equal(job.completedByFreelancer, true);
                    });

                    it("should emit a FreelancerCompletedJob event", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await expect(await freePharma.connect(addr2).completeFreelancerJob(0))
                            .to.emit(freePharma,"FreelancerCompletedJob")
                    });

                    it("should forbid a freelancer to complete a job if he was not hired", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await expect(freePharma.connect(addr3).completeFreelancerJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to complete a job that does not exist", async function () {
                        await expect(freePharma.connect(addr3).completeFreelancerJob(10))
                            .to.be.reverted;
                    });

                    it("should forbid an employer to complete a job as a freelancer", async function () {
                        await expect(freePharma.connect(addr1).completeFreelancerJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to complete a job as a freelancer", async function () {
                        await expect(freePharma.connect(unknown).completeFreelancerJob(0))
                            .to.be.reverted;
                    });
                });

                describe("claimSalary()", function () {
                    it("should allow a freelancer to claim his salary", async function () {
                        let freelancerBalance = await tokenPHARM.balanceOf(addr2.address);
                        let employerBalance = await tokenPHARM.balanceOf(addr1.address);

                        assert.equal(freelancerBalance.toString(), "0");
                        assert.equal(employerBalance.toString(), "100000");
                        
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await freePharma.connect(addr2).completeFreelancerJob(0);
                        await freePharma.connect(addr2).claimSalary(0);

                        let job = await freePharma.connect(addr2).getOneJob(0);
                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        freelancerBalance = await tokenPHARM.balanceOf(addr2.address);
                        employerBalance = await tokenPHARM.balanceOf(addr1.address);


                        assert.equal(freelancerBalance.toString(), "5000");
                        assert.equal(employerBalance, "95000");
                        assert.isTrue(job.completedByFreelancer);
                        assert.isFalse(job.completedByEmployer);
                        assert.equal(job.status, 4);
                        assert.isTrue(job.claimed);
                    });

                    it("should emit a FreelancerClaimedSalary event", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await freePharma.connect(addr2).completeFreelancerJob(0);
                        await expect(await freePharma.connect(addr2).claimSalary(0))
                            .to.emit(freePharma,"FreelancerClaimedSalary")
                    });

                    it("should forbid a freelancer to claim his salary if he was not hired", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await freePharma.connect(addr2).completeFreelancerJob(0);

                        await expect(freePharma.connect(addr3).claimSalary(0))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to claim his salary if the job is not completed", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);

                        await expect(freePharma.connect(addr2).claimSalary(0))
                            .to.be.revertedWithCustomError(freePharma, 'NotAuthorized');
                    });
                    
                    it("should forbid a freelancer to claim a salary for a job that does not exist", async function () {
                        await expect(freePharma.connect(addr2).claimSalary(10))
                            .to.be.reverted;
                    });

                    it("should forbid an employer to claim a salary as a freelancer", async function () {
                        await expect(freePharma.connect(addr1).claimSalary(0))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to claim a salary as a freelancer", async function () {
                        await expect(freePharma.connect(unknown).claimSalary(0))
                            .to.be.reverted;
                    });
                });

            });

            describe("Employers functions", function () {
                describe("hireFreelancer()", function () {
                    it("should allow an employer to hire a freelancer", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);

                        let freelancer = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        let job = await freePharma.connect(addr2).getOneJob(0);

                        assert.equal(freelancer.hiredJobIds.length, 1);
                        assert.equal(freelancer.hiredJobIds[0], 0);
                        assert.equal(job.status, 1);
                    });

                    it("should allow an employer to send hire invitation for several freelancers", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr3).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr1).hireFreelancer(0, addr3.address);

                        let freelancer1 = await freePharma.connect(addr2).getOneFreelancer(addr2.address);
                        let freelancer2 = await freePharma.connect(addr3).getOneFreelancer(addr3.address);
                        
                        assert.equal(freelancer1.hiredJobIds.length, 1);
                        assert.equal(freelancer1.hiredJobIds[0], 0);
                        assert.equal(freelancer2.hiredJobIds.length, 1)
                        assert.equal(freelancer2.hiredJobIds[0], 0);
                    });

                    it("should emit a FreelancerHired event", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(await freePharma.connect(addr1).hireFreelancer(0, addr2.address))
                            .to.emit(freePharma,"EmployerHiredFreelancer")
                    });

                    it("should forbid an employer to hire a freelancer if he is not the owner of the job", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr4).createEmployer("wrongEmployer", "wrong@example.com", true );

                        await expect(freePharma.connect(addr4).hireFreelancer(0, addr2.address))
                            .to.be.reverted;
                    });

                    it("should forbid an employer to hire a freelancer if the job does not exist", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(addr1).hireFreelancer(10, addr2.address))
                            .to.be.reverted;
                    });

                    it("should forbid an employer to hire a freelancer if the freelancer does not exist", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(addr1).hireFreelancer(0, addr4.address))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to call that function", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(addr2).hireFreelancer(0, addr2.address))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to call that function", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(unknown).hireFreelancer(0, addr2.address))
                            .to.be.reverted;
                    });
                });

                describe("completeEmployerJob()", function () {
                    it("should allow an employer to complete his job", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await freePharma.connect(addr1).completeEmployerJob(0);

                        let job = await freePharma.connect(addr2).getOneJob(0);

                        assert.equal(job.status, 4);
                    });

                    it("should emit a EmployerCompletedJob event", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);
                        await expect(await freePharma.connect(addr1).completeEmployerJob(0))
                            .to.emit(freePharma,"EmployerCompletedJob")
                    });

                    it("should forbid an employer to complete a job if he is not the owner of the job", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr4).createEmployer("wrongEmployer", "wrong@example.com", true );
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);

                        await expect(freePharma.connect(addr4).completeEmployerJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid an employer to complete a job if the job does not exist", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await expect(freePharma.connect(addr1).completeEmployerJob(10))
                            .to.be.reverted;
                    });

                    it("should forbid a freelancer to call that function", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);

                        await expect(freePharma.connect(addr2).completeEmployerJob(0))
                            .to.be.reverted;
                    });

                    it("should forbid an unknown account to call that function", async function () {
                        await freePharma.connect(addr2).applyForJob(0);
                        await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
                        await freePharma.connect(addr2).confirmCandidature(0);

                        await expect(freePharma.connect(unknown).completeEmployerJob(0))
                            .to.be.reverted;
                    });
                });
            });
        });
    });


    context("Integration test", function () {
        before(async function () {
            // fetch accounts once, instanciation of all those variables
            [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
                await ethers.getSigners();

            // PHARM token deployment
            let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
            tokenPHARM = await TokenPHARM.deploy();

            // DataStorage deployment
            let DataStorage = await hre.ethers.getContractFactory("DataStorage");
            dataStorage = await DataStorage.deploy(tokenPHARM.address);

            // FreePharma deployment
            let FreePharma = await hre.ethers.getContractFactory("FreePharma");
            freePharma = await FreePharma.deploy(
                dataStorage.address,
                tokenPHARM.address
            );

            // PHARM token minting
            await tokenPHARM.mint(admin.address, 100000);
            await tokenPHARM.mint(addr1.address, 100000);
            await tokenPHARM.connect(addr1).approve(dataStorage.address, 100000);
        });

        it("should allow an employer registration", async function () {
            await freePharma.connect(addr1).createEmployer("Sanofi", "test@example.com", true);
            let employer = await freePharma.connect(addr1).getOneEmployer(addr1.address);

        });
        
        it("should allow an employer to create a job", async function () {
            // in this sample project we use seconds instead of days
            const currentTime = Math.floor(Date.now() / 1000);
            const startDate = currentTime;
            const endDate = startDate + 2 * 24 * 60 * 60; // add 2 seconds
            const salary = 5000;
            const location = "Paris";

            let jobCount = await dataStorage.getJobCount();
            expect(jobCount).to.equal(0);

            await freePharma
                .connect(addr1)
                .createJob(startDate, endDate, salary, location);

            jobCount = await dataStorage.getJobCount();
            expect(jobCount).to.equal(1);
        });
        
        it("should allow a freelancer registration", async function () {
            let freelancerCount = await dataStorage.getFreelancerCount();
            assert.equal(freelancerCount.toString(), '0');

            await freePharma.connect(addr2).createFreelancer("John", "test@example.com", "Paris", 250, true, true );

            freelancerCount = await dataStorage.getFreelancerCount();
            assert.equal(freelancerCount.toString(), '1');
        });
        
        it("should allow a freelancer to apply for a job", async function () {
            await freePharma.connect(addr2).applyForJob(0);
            let job = await freePharma.getOneJob(0);
            await expect(job.candidates[0]).to.equal(addr2.address);
        });
        
        it("should allow an employer to hire a applicant", async function () {
            await freePharma.connect(addr1).hireFreelancer(0, addr2.address);
            let job = await dataStorage.getJob(0);

            let freelancer = await dataStorage.getFreelancer(addr2.address);
            let hiredList = freelancer.hiredJobIds;
            await expect(hiredList.length).to.equal(1);
            await expect(hiredList[0], ethers.utils.formatBytes32String("0"));
            await expect(job.status).to.equal(1);
        });

        it("should allow a freelancer to confirm his candidature", async function () {
            await freePharma.connect(addr2).confirmCandidature(0);
            let job = await freePharma.getOneJob(0);
            await expect(job.status).to.equal(2);
            await expect(job.freelancerAddress).to.equal(addr2.address);
        });
        
        it("should allow a freelancer to indicate the job as completed", async function () {
            await freePharma.connect(addr2).completeFreelancerJob(0);
            let job = await freePharma.getOneJob(0);
            await expect(job.status).to.equal(3);
        });
        
        it("should allow an employer to indicate the job as completed", async function () {
            let freelancerBalanceBefore = await tokenPHARM.balanceOf(addr2.address);
            await expect(freelancerBalanceBefore.toString()).to.equal('0');

            await freePharma.connect(addr1).completeEmployerJob(0);
            
            let freelancerBalanceAfter = await tokenPHARM.balanceOf(addr2.address);
            await expect(freelancerBalanceAfter.toString()).to.equal('5000');
        });
        
        it("should have updated data", async function () {
            let freelancer = await freePharma.getOneFreelancer(addr2.address);
            await expect(freelancer.appliedJobIds.length).to.equal(0);
            await expect(freelancer.hiredJobIds.length).to.equal(0);
            await expect(freelancer.completedJobIds.length).to.equal(1);

            let employer = await freePharma.getOneEmployer(addr1.address);
            await expect(employer.currentJobOffersIds.length).to.equal(0);
            await expect(employer.startedJobOffersIds.length).to.equal(0);
            await expect(employer.completedJobOffersIds.length).to.equal(1);
        });
        
    });
});
