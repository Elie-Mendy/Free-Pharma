const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("DataStorage - storage smart contract", function () {
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
            let DataStorage = await hre.ethers.getContractFactory(
                "DataStorage"
            );
            dataStorage = await DataStorage.deploy(tokenPHARM.address);
        });

        it("should set the right owner", async function () {
            expect(await dataStorage.owner()).to.equal(admin.address);
        });

        it("should set the right PHARM token address", async function () {
            expect(await dataStorage.tokenPHARM()).to.equal(tokenPHARM.address);
        });

        it("should be deployed without any job", async function () {
            expect(await dataStorage.getJobCount()).to.equal(0);
        });

        it("should be deployed without any freelancer", async function () {
            expect(await dataStorage.getFreelancerCount()).to.equal(0);
        });

        it("should be deployed without any employer", async function () {
            expect(await dataStorage.getEmployerCount()).to.equal(0);
        });
    });

    context("Admin Function unit tests", function () {
        before(async function () {
            // fetch accounts once, instanciation of all those variables
            [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
                await ethers.getSigners();

            // PHARM token deployment
            let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
            tokenPHARM = await TokenPHARM.deploy();

            // DataStorage deployment
            let DataStorage = await hre.ethers.getContractFactory(
                "DataStorage"
            );
            dataStorage = await DataStorage.deploy(tokenPHARM.address);

            // FreePharma deployment
            let FreePharma = await hre.ethers.getContractFactory("FreePharma");
            freePharma = await FreePharma.deploy(
                dataStorage.address,
                tokenPHARM.address
            );
        });

        describe("setBusinessLogicContract()", async () => {
            it("should set the business logic contract address", async function () {
                await dataStorage.setBusinessLogicContract(freePharma.address);
                expect(await dataStorage.businessLogicContract()).to.equal(
                    freePharma.address
                );
            });

            it("should only allow the owner to set the business logic contract address", async function () {
                await expect(dataStorage.connect(unknown).setBusinessLogicContract(freePharma.address)).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });
    }); 

    context("Function unit tests", function () {

        context("Entities - creation and data fetching", function () {
            // Contracts deployment
            beforeEach(async function () {
                // fetch accounts once, instanciation of all those variables
                [admin, addr1, addr2, addr3, addr4, unknown, addresses] = await ethers.getSigners();

                // PHARM token deployment
                let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
                tokenPHARM = await TokenPHARM.deploy();

                // DataStorage deployment
                let DataStorage = await hre.ethers.getContractFactory(
                    "DataStorage"
                );
                dataStorage = await DataStorage.deploy(tokenPHARM.address);
            });

            describe("Freelancers functions", () => {
                describe("createFreelancer()", async () => {
                    it("should create a freelancer", async function () {
                        expect(await dataStorage.getFreelancerCount()).to.equal(0);
        
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);
        
                        expect(await dataStorage.getFreelancerCount()).to.equal(1);
                    });
        
                    it("should create a freelancer with right values", async function () {
                        let name = "John";
                        let email = "test@example.com";
                        let location = "Paris";
                        let averageDailyRate = 250;
                        let availabilty = true;
                        let visibility = true;
        
                        await dataStorage.connect(addr1).createFreelancer(
                            addr1.address, 
                            name, 
                            email,
                            location, 
                            averageDailyRate,
                            availabilty, 
                            visibility
                        );
        
                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.averageDailyRate.toString(),averageDailyRate);
                        assert.equal(freelancer.name,name);
                        assert.equal(freelancer.email,email);
                        assert.equal(freelancer.location,location);
                        assert.equal(freelancer.appliedJobIds.length,0);
                        assert.equal(freelancer.hiredJobIds.length,0);
                        assert.equal(freelancer.completedJobIds.length,0);
                        assert.equal(freelancer.available, availabilty);
                        assert.equal(freelancer.visible, visibility);
                    });
                });
        
                describe("getFreelancer()", async () => {
                    it("should get the right freelancer", async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);
                        await dataStorage.connect(addr2).createFreelancer(addr2.address, "Jane", "jane@example.com", "London", 350,true, false);
                        await dataStorage.connect(addr3).createFreelancer(addr3.address, "Joe","joe@example.com", "Bogota", 450, true, true);
        
                        let John = await dataStorage.getFreelancer(addr1.address);
                        let Jane = await dataStorage.getFreelancer(addr2.address);
                        let Joe = await dataStorage.getFreelancer(addr3.address);
        
                        assert.equal(John.name, "John");
                        assert.equal(John.email, "john@example.com");
                        assert.equal(John.location, "Paris");
                        assert.equal(John.averageDailyRate.toString(), 250);
                        assert.isFalse(John.available);
                        assert.isFalse(John.visible);
        
                        assert.equal(Jane.name, "Jane");
                        assert.equal(Jane.email, "jane@example.com");
                        assert.equal(Jane.location, "London");
                        assert.equal(Jane.averageDailyRate.toString(), 350);
                        assert.isTrue(Jane.available);
                        assert.isFalse(Jane.visible);
        
                        assert.equal(Joe.name, "Joe");
                        assert.equal(Joe.email, "joe@example.com");
                        assert.equal(Joe.location, "Bogota");
                        assert.equal(Joe.averageDailyRate.toString(), 450);
                        assert.isTrue(Joe.available);
                        assert.isTrue(Joe.visible);
                    });
                });
        
                describe("getFreelancers()", async () => {
                    it("should get all freelancers", async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);
                        await dataStorage.connect(addr2).createFreelancer(addr1.address, "Jane", "jane@example.com", "London", 350,true, false);
                        await dataStorage.connect(addr3).createFreelancer(addr1.address, "Joe", "joe@example.com", "Bogota", 450, true, true);
        
                        let freelancers = await dataStorage.getFreelancers();
        
                        assert.equal(freelancers.length, 3);
                    });
                });
        
                describe("getFreelancerJobApplied()", async () => {
                    it("should get all jobs applied by a freelancer", async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi","sanofi@employer.com", true);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer","sanofi@employer.com", true);
        
                        // employers create jobs
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
        
                        // freelancer apply for jobs
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        await dataStorage.connect(addr1).applyForJob(1, addr1.address);
        
                        let jobsApplied = await dataStorage.getFreelancerJobApplied(addr1.address);
                        
                        assert.equal(jobsApplied.length, 2);
                        assert.equal(jobsApplied[0].toString(), 0);
                        assert.equal(jobsApplied[1].toString(), 1);
                    });
                });
        
                describe("getFreelancerJobHired()", async () => {
                    if("should get all jobs for which a freelancer has been hired", async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi","sanofi@employer.com", true);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer","sanofi@employer.com", true);
        
                        // employers create jobs
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
        
                        // freelancer apply for jobs
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        await dataStorage.connect(addr1).applyForJob(1, addr1.address);

                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        await dataStorage.connect(addr2).hireFreelancer(1, addr1.address);

                        let jobsHired = await dataStorage.getFreelancerJobHired(addr1.address);
                        assert.equal(jobsHired.length, 2);
                        assert.equal(jobsHired[0].toString(), 0);
                        assert.equal(jobsHired[1].toString(), 1);
                    });
                });
        
                describe("getFreelancerJobCompleted()", async () => {
                    if("should get all completed job of a freelancer", async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi","sanofi@employer.com", true);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer","sanofi@employer.com", true);
        
                        // employers create jobs
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
        
                        // freelancer apply for jobs
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        await dataStorage.connect(addr1).applyForJob(1, addr1.address);

                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        await dataStorage.connect(addr2).hireFreelancer(1, addr1.address);

                        // freelancer complete job
                        await dataStorage.connect(addr1).completeJob(0, addr1.address);
                        await dataStorage.connect(addr1).completeJob(1, addr1.address);

                        let jobsCompleted = await dataStorage.getFreelancerJobCompleted(addr1.address);
                        assert.equal(jobsCompleted.length, 2);
                        assert.equal(jobsCompleted[0].toString(), 0);
                        assert.equal(jobsCompleted[1].toString(), 1);
                    });
                });

                describe("setFreelancer()", async () => {
                    it(("should update the freelancer with the right values"), async function () {
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);

                        let name = "Jane";
                        let email = "jane@example.com";
                        let location = "London";
                        let averageDailyRate = 350;
                        let available = true;
                        let visible = false;

                        await dataStorage.connect(addr1).setFreelancer(
                            addr1.address,
                            name,
                            email,
                            location,
                            averageDailyRate,
                            available,
                            visible
                        );

                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.name, name);
                        assert.equal(freelancer.email, email);
                        assert.equal(freelancer.location, location);
                        assert.equal(freelancer.averageDailyRate.toString(), averageDailyRate);
                        assert.isTrue(freelancer.available);
                        assert.isFalse(freelancer.visible);
                    });
                });


            });

            describe("Employers functions", () => {
                describe("createEmployer()", async () => {
                    it("should create an employer", async function () {
                        expect(await dataStorage.getEmployerCount()).to.equal(0);
        
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
        
                        expect(await dataStorage.getEmployerCount()).to.equal(1);
                    });
        
                    it("should create a freelancer with right values", async function () {
                        let name = "Sanofi";
                        let email = "sanoif@example.com";
                        let visibility = true;
        
                        await dataStorage.connect(addr2).createEmployer(
                            addr2.address, 
                            name, 
                            email,
                            visibility
                        );
        
                        let employer = await dataStorage.getEmployer(addr2.address);
                        assert.equal(employer.name,name);
                        assert.equal(employer.email,email);
                        assert.equal(employer.currentJobOffersIds.length,0);
                        assert.equal(employer.startedJobOffersIds.length,0);
                        assert.equal(employer.completedJobOffersIds.length,0);
                        assert.equal(employer.visible, visibility);
                    });
                });
        
                describe("getEmployer()", async () => {
                    it("should get the right employer", async function () {
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer", "pfizer@example.com", false);
                        await dataStorage.connect(addr4).createEmployer(addr4.address, "Boiron","boiron@example.com", true);
        
                        let sanofi = await dataStorage.getEmployer(addr2.address);
                        let pfizer = await dataStorage.getEmployer(addr3.address);
                        let boiron = await dataStorage.getEmployer(addr4.address);
        
                        assert.equal(sanofi.name, "Sanofi");
                        assert.equal(sanofi.email, "sanofi@example.com");
                        assert.isFalse(sanofi.visible);
        
                        assert.equal(pfizer.name, "Pfizer");
                        assert.equal(pfizer.email, "pfizer@example.com");
                        assert.isFalse(pfizer.visible);
        
                        assert.equal(boiron.name, "Boiron");
                        assert.equal(boiron.email, "boiron@example.com");
                        assert.isTrue(boiron.visible);
                    });
                });
        
                describe("getEmployers()", async () => {
                    it("should get all freelancers", async function () {
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer", "pfizer@example.com", false);
                        await dataStorage.connect(addr4).createEmployer(addr4.address, "Boiron","boiron@example.com", true);
        
                        let employers = await dataStorage.getEmployers();
        
                        assert.equal(employers.length, 3);
                    });
                });

                describe("setEmployer", async () => {
                    it(("should update the employer with the right values"), async function () {
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi.example.com", false);

                        let name = "Pfizer";
                        let email = "pfizer@example.com";
                        let visibility = true;

                        await dataStorage.connect(addr2).setEmployer(
                            addr2.address,
                            name,
                            email,
                            visibility
                        );

                        let employer = await dataStorage.getEmployer(addr2.address);
                        assert.equal(employer.name, name);
                        assert.equal(employer.email, email);
                        assert.equal(employer.visible, visibility);
                    });
                });
            });

            describe("Jobs functions", () => {
                describe("createJob()", async () => {
                    // stock a startDate and an endDate
                    let startDate = new Date(2023, 0, 1); // January 1, 2023
                    let endDate = new Date(2023, 1, 1); // January 1, 2023
                    
                    // convert them to timestamp
                    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
                    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
                    let salary = 5000

                    // employer creation
                    await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                    // check if the job count is 0
                    expect(await dataStorage.getJobCount()).to.equal(0);
                    // employer create job
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);

                    let job = await dataStorage.getJob(0);
                    expect(await dataStorage.getJobCount()).to.equal(1);
                });

                describe("getJob()", async () => {
                    it("should get the right job", async function () {

                        // employers creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer", "pfizer@example.com", false);
                        await dataStorage.connect(addr4).createEmployer(addr4.address, "Boiron","boiron@example.com", true);
                        
                        // jobs creation
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        await dataStorage.connect(addr3).createJob(addr3.address, startDateTimestamp, endDateTimestamp, salary, "Toulouse");
                        await dataStorage.connect(addr4).createJob(addr4.address, startDateTimestamp, endDateTimestamp, salary, "Marseille");

                        let job1 = await dataStorage.getJob(0);
                        let job2 = await dataStorage.getJob(1);
                        let job3 = await dataStorage.getJob(2);
        
                        assert.equal(job1.employerAddress, addr2.address);
                        assert.equal(job1.startDate, startDateTimestamp);
                        assert.equal(job1.endDate, endDateTimestamp);
                        assert.equal(job1.salary, salary);
                        assert.equal(job1.location, "Paris");

                        assert.equal(job2.employerAddress, addr3.address);
                        assert.equal(job2.startDate, startDateTimestamp);
                        assert.equal(job2.endDate, endDateTimestamp);
                        assert.equal(job2.salary, salary);
                        assert.equal(job2.location, "Toulouse");
                        
                        assert.equal(job3.employerAddress, addr4.address);
                        assert.equal(job3.startDate, startDateTimestamp);
                        assert.equal(job3.endDate, endDateTimestamp);
                        assert.equal(job3.salary, salary);
                        assert.equal(job3.location, "Marseille");
                    });
                });

                describe("getJobs()", async () => {
                    it("should get all jobs", async function () {
                        // employers creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer", "pfizer@example.com", false);
                        await dataStorage.connect(addr4).createEmployer(addr4.address, "Boiron","boiron@example.com", true);
                        
                        // jobs creation
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        await dataStorage.connect(addr3).createJob(addr3.address, startDateTimestamp, endDateTimestamp, salary, "Toulouse");
                        await dataStorage.connect(addr4).createJob(addr4.address, startDateTimestamp, endDateTimestamp, salary, "Marseille");

                        let jobs = await dataStorage.getJobs();
                        assert.equal(jobs.length, 3);
                    });
                });

                describe("setJob()", async () => {
                    it(("should update the job with the right values"), async function () {
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi.example.com", false);
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);

                        let job = await dataStorage.getJob(0);
                        assert.equal(job.employerAddress, addr2.address);
                        assert.equal(job.startDate, startDateTimestamp);
                        assert.equal(job.endDate, endDateTimestamp);
                        assert.equal(job.salary, salary);
                        assert.equal(job.location, location);

                        // stock a new startDate and a new endDate
                        let newStartDate = new Date(2023, 5, 1); // January 5, 2023
                        let newEndDate = new Date(2023, 6, 1); // January 6, 2023
                        
                        // convert them to timestamp
                        let newStartDateTimestamp = Math.floor(newStartDate.getTime() / 1000);
                        let newEndDateTimestamp = Math.floor(newEndDate.getTime() / 1000);
                        let newSalary = 5000
                        let newLocation = "Toulouse"

                        await dataStorage.connect(addr2).setJob(
                            0,
                            newSalary,
                            newStartDateTimestamp,
                            newEndDateTimestamp,
                            newLocation
                        );

                        job = await dataStorage.getJob(0);
                        assert.equal(job.employerAddress, addr2.address);
                        assert.equal(job.startDate.toString(), newStartDateTimestamp);
                        assert.equal(job.endDate.toString(), newEndDateTimestamp);
                        assert.equal(job.salary.toString(), newSalary);
                        assert.equal(job.location, "Toulouse");

                    });
                });

                describe("getJobStatus()", async () => {
                    it("should get the right job status", async function () {
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // check if the job count is 0
                        expect(await dataStorage.getJobCount()).to.equal(0);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        // check if the job status is 0
                        expect(await dataStorage.getJobStatus(0)).to.equal(0);
                    });
                });

                describe("getJobNbCandidates", async () => {
                    it("should get the right number of candidates", async function () {
                        // freelancer creation
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // check if the job count is 0
                        expect(await dataStorage.getJobCount()).to.equal(0);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        // freelancer apply to job
                        await dataStorage.connect(addr1).applyForJob(0, addr2.address);

                        let getJobNbCandidates = await dataStorage.getJobNbCandidates(0);
                        expect(getJobNbCandidates).to.equal(1);
                    });
                });

                describe("getJobEmployerAddress", async () => {
                    it("should get the right employer address", async function () {
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // check if the job count is 0
                        expect(await dataStorage.getJobCount()).to.equal(0);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        
                        let getJobEmployerAddress = await dataStorage.getJobEmployerAddress(0);
                        expect(getJobEmployerAddress).to.equal(addr2.address);
                    });
                });

                describe("getJobFreelancerAddress", async () => {
                    it("should get the right freelancer address", async function () {
                        // freelancer creation
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        // freelancer apply to job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);

                        let getJobFreelancerAddress = await dataStorage.getJobFreelancerAddress(0);
                        expect(getJobFreelancerAddress).to.equal(addr1.address);
                    });
                });

                describe("getJobSalary()", async () => {
                    it("should get the right job salary", async function () {
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // check if the job count is 0
                        expect(await dataStorage.getJobCount()).to.equal(0);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                        
                        let getJobSalary = await dataStorage.getJobSalary(0);
                        expect(getJobSalary).to.equal(salary);
                    });
                });

                describe("getJobEndDate()", async () => {
                    it("should get the right job end date", async function () {
                        // freelancer creation
                        await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                        // employer creation
                        await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                        // employer create job
                        await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);

                        let endDate = await dataStorage.getJobEndDate(0);
                        expect(endDate).to.equal(endDateTimestamp);
                    });
                });
            });
        });

        context("Hiring / Payment - prosess functions", async () => {
            // Contracts deployment
            beforeEach(async function () {
                // fetch accounts once, instanciation of all those variables
                [admin, addr1, addr2, addr3, addr4, unknown, addresses] = await ethers.getSigners();

                // PHARM token deployment
                let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
                tokenPHARM = await TokenPHARM.deploy();

                // DataStorage deployment
                let DataStorage = await hre.ethers.getContractFactory(
                    "DataStorage"
                );
                dataStorage = await DataStorage.deploy(tokenPHARM.address);

                // PHARM token minting and allowance approval for employer (addr2)
                await tokenPHARM.mint(addr2.address, 10000);
                await tokenPHARM.connect(addr2).approve(dataStorage.address, 10000);
                
                // data preperation for the tests
                await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "freelancer@freelancer.com", "Paris", 250, false, false);
                await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi","sanofi@employer.com", true);

                // stock a startDate and an endDate
                let startDate = new Date(2023, 0, 1); // January 1, 2023
                let endDate = new Date(2023, 1, 1); // January 1, 2023
                
                // convert them to timestamp
                let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
                let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
                let salary = 5000

                // employer create job
                await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
            });

            describe("Freelancers functions", () => {
                describe("applyForJob()", async () => {
                    it("should allow a freelancer to apply for a job", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
        
                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        let job = await dataStorage.getJob(0);
                        
                        assert.equal(freelancer.appliedJobIds.length, 1);
                        assert.equal(freelancer.appliedJobIds[0].toString(), 0);
                        assert.equal(job.candidates.length, 1);
                        assert.equal(job.candidates[0], addr1.address);
                    });
                });
        
                describe("confirmCandidature()", async () => {
                    it("should add the job id into the employer completed startedJobOffersIds list", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer confirm candidature
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
    
                        let employer = await dataStorage.connect(addr2).getEmployer(addr2.address);
    
                        assert.equal(employer.currentJobOffersIds.length, 1);
                        assert.equal(employer.currentJobOffersIds[0].toString(), 0);
                        assert.equal(employer.startedJobOffersIds.length, 0);
                        assert.equal(employer.completedJobOffersIds.length, 0);
    
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
                        employer = await dataStorage.connect(addr2).getEmployer(addr2.address);
    
                        assert.equal(employer.currentJobOffersIds.length, 0);
                        assert.equal(employer.startedJobOffersIds.length, 1);
                        assert.equal(employer.startedJobOffersIds[0].toString(), 0);
                        assert.equal(employer.completedJobOffersIds.length, 0);
    
                    });
    
                    it("should modify the job status to IN_PROGRESS", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '1');
    
                        // freelancer confirm candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
    
                        job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '2');
                    });
                });
    
                describe("completeFreelancerJob()", async () => {
                    it("should modify the job status to COMPLETED", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '2');
    
                        // freelancer complete job
                        await dataStorage.connect(addr1).completeFreelancerJob(0);
    
                        job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '3');
                    });
                });
    
                describe("processClaim()", async () => {
                    it("should update the 'claimed' job attribute to true", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
                        // freelancer complete job
                        await dataStorage.connect(addr1).completeFreelancerJob(0);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.claimed, false);
    
                        // employer process claim
                        await dataStorage.connect(addr1).processClaim(0);
    
                        job = await dataStorage.getJob(0);
                        assert.equal(job.claimed, true);
                    });
    
                    it("should add the job id into the freelancer completed completedJobIds list", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
                        // freelancer complete job
                        await dataStorage.connect(addr1).completeFreelancerJob(0);
    
                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 0);
                        assert.equal(freelancer.hiredJobIds.length, 1);
                        assert.equal(freelancer.completedJobIds.length, 0);
    
                        // employer process claim
                        await dataStorage.connect(addr1).processClaim(0);
    
                        freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 0);
                        assert.equal(freelancer.hiredJobIds.length, 0);
                        assert.equal(freelancer.completedJobIds.length, 1);
                        assert.equal(freelancer.completedJobIds[0].toString(), 0);
                    });
                });
            });

            describe("Employers functions", async () => {
                describe("hireFreelancer", async () => {

                    it("should modify the job status to CANDIDATURE_PENDING", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '1');
                    });

                    it("should add the job id into the freelancer hiredJobIds list", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);

                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 1);
                        assert.equal(freelancer.hiredJobIds.length, 0);
                        assert.equal(freelancer.completedJobIds.length, 0);
    
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
    
                        freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 0);
                        assert.equal(freelancer.hiredJobIds.length, 1);
                        assert.equal(freelancer.hiredJobIds[0].toString(), 0);
                        assert.equal(freelancer.completedJobIds.length, 0);
                    });
                });

                describe("completeEmployerJob", async () => {
                    it("should note the job as completed by employer", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
    
                        let job = await dataStorage.getJob(0);
                        assert.isFalse(job.completedByEmployer);
    
                        // employer complete job
                        await dataStorage.connect(addr2).completeEmployerJob(0);
    
                        job = await dataStorage.getJob(0);
                        assert.isTrue(job.completedByEmployer);
                    });

                    it("should modify the job status to COMPLETED", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '2');
    
                        // employer complete job
                        await dataStorage.connect(addr2).completeEmployerJob(0);
    
                        job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '3');
                    });

                    it("should add the job id into the freelancer completedJobIds list", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
    
                        let freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 0);
                        assert.equal(freelancer.hiredJobIds.length, 1);
                        assert.equal(freelancer.completedJobIds.length, 0);
    
                        // employer complete job
                        await dataStorage.connect(addr2).completeEmployerJob(0);
    
                        freelancer = await dataStorage.getFreelancer(addr1.address);
                        assert.equal(freelancer.appliedJobIds.length, 0);
                        assert.equal(freelancer.hiredJobIds.length, 0);
                        assert.equal(freelancer.completedJobIds.length, 1);
                        assert.equal(freelancer.completedJobIds[0].toString(), 0);
                    });
                });

                describe("payFreelancer", async () => {
                    it("should modify the job status to PAID", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
                        // employer complete job
                        await dataStorage.connect(addr2).completeEmployerJob(0);
    
                        let job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '3');

                        // employer pay freelancer
                        await dataStorage.payFreelancer(0);

                        job = await dataStorage.getJob(0);
                        assert.equal(job.status.toString(), '4');
                    });

                    it("should transfer the salary to the freelancer", async function () {
                        // freelancer apply for job
                        await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                        // employer hire freelancer
                        await dataStorage.connect(addr2).hireFreelancer(0, addr1.address);
                        // freelancer confirm his candidature
                        await dataStorage.connect(addr1).confirmCandidature(0, addr1.address);
                        // employer complete job
                        await dataStorage.connect(addr2).completeEmployerJob(0);

                        let freelancerBalanceBefore = await tokenPHARM.balanceOf(addr1.address);
                        await expect(freelancerBalanceBefore.toString()).to.equal('0');
            
                        await dataStorage.payFreelancer(0);
                        
                        let freelancerBalanceAfter = await tokenPHARM.balanceOf(addr1.address);
                        await expect(freelancerBalanceAfter.toString()).to.equal('5000');
                    });
                });
            });   
        });

        context("Helpers functions", async () => {
            // Contracts deployment
            beforeEach(async function () {
                // fetch accounts once, instanciation of all those variables
                [admin, addr1, addr2, addr3, addr4, unknown, addresses] = await ethers.getSigners();

                // PHARM token deployment
                let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
                tokenPHARM = await TokenPHARM.deploy();

                // DataStorage deployment
                let DataStorage = await hre.ethers.getContractFactory(
                    "DataStorage"
                );
                dataStorage = await DataStorage.deploy(tokenPHARM.address);
            });

            describe("getJobCount()", async () => {
                it("should return the number of jobs", async function () {
                    // stock a startDate and an endDate
                    let startDate = new Date(2023, 0, 1); // January 1, 2023
                    let endDate = new Date(2023, 1, 1); // January 1, 2023
                    
                    // convert them to timestamp
                    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
                    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
                    let salary = 5000

                    // employer creation
                    await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                    // check if the job count is 0
                    expect(await dataStorage.getJobCount()).to.equal(0);
                    // employer create job
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, "Toulouse");
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, "Lyon");
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, "Marseille");

                    let job = await dataStorage.getJob(0);
                    expect(await dataStorage.getJobCount()).to.equal(4);
                });
            });

            describe("getFreelancerCount()", async () => {
                it("should return the right number of freelancers", async function () {
                    expect(await dataStorage.getFreelancerCount()).to.equal(0);
        
                    await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);
                    await dataStorage.connect(addr2).createFreelancer(addr2.address, "Jane", "jane@example.com", "London", 350,true, false);
                    await dataStorage.connect(addr3).createFreelancer(addr3.address, "Joe","joe@example.com", "Bogota", 450, true, true);
        
                    expect(await dataStorage.getFreelancerCount()).to.equal(3);
                });
            });

            describe("getEmployerCount()", async () => {
                it("should return the right number of employers", async function () {
                    expect(await dataStorage.getEmployerCount()).to.equal(0);
        
                    await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                    await dataStorage.connect(addr3).createEmployer(addr3.address, "Pfizer", "pfizer@example.com", false);
                    await dataStorage.connect(addr4).createEmployer(addr4.address, "Boiron","boiron@example.com", true);
        
                    expect(await dataStorage.getEmployerCount()).to.equal(3);
                });

            });

            describe("freelancerAppliedToJob()", async () => {
                it("should return true if the freelancer applied to the job", async function () {
                    // stock a startDate and an endDate
                    let startDate = new Date(2023, 0, 1); // January 1, 2023
                    let endDate = new Date(2023, 1, 1); // January 1, 2023
                    
                    // convert them to timestamp
                    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
                    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
                    let salary = 5000

                    // employer creation
                    await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                    // check if the job count is 0
                    expect(await dataStorage.getJobCount()).to.equal(0);
                    // employer create job
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                    // freelancer creation 
                    await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);
                    // freelancer apply for job
                    await dataStorage.connect(addr1).applyForJob(0, addr1.address);
                    // check if the freelancer applied to the job
                    assert.isTrue(await dataStorage.freelancerAppliedToJob(addr1.address, 0));
                });

                it("should return false if the freelancer didn't applied to the job", async function () {
                    // stock a startDate and an endDate
                    let startDate = new Date(2023, 0, 1); // January 1, 2023
                    let endDate = new Date(2023, 1, 1); // January 1, 2023
                    
                    // convert them to timestamp
                    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
                    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);
                    let salary = 5000

                    // employer creation
                    await dataStorage.connect(addr2).createEmployer(addr2.address, "Sanofi", "sanofi@example.com", false);
                    // check if the job count is 0
                    expect(await dataStorage.getJobCount()).to.equal(0);
                    // employer create job
                    await dataStorage.connect(addr2).createJob(addr2.address, startDateTimestamp, endDateTimestamp, salary, location);
                    // freelancer creation 
                    await dataStorage.connect(addr1).createFreelancer(addr1.address, "John", "john@example.com", "Paris", 250, false, false);

                    // check if the freelancer applied to the job
                    assert.isFalse(await dataStorage.freelancerAppliedToJob(addr1.address, 0));
                });
            });
        }); 
    });
});
