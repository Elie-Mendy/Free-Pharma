const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test FreePharma - business logic smart contract", function () {
    let tokenPHARM, dataStorage, freePharma;
    let admin, addr1, addr2, addr3, addr4, unknown, addresses;

    let DEFAULT_ADMIN_ROLE =
        ethers.utils.formatBytes32String("DEFAULT_ADMIN_ROLE");
    let ADMIN = ethers.utils.formatBytes32String("ADMIN");
    let EMPLOYER_ROLE = ethers.utils.formatBytes32String("EMPLOYER_ROLE");
    let FREELANCER_ROLE = ethers.utils.formatBytes32String("FREELANCER_ROLE");

    describe("Deployment", function () {
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

    describe("Integration test", function () {
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

            // PHARM token minting
            await tokenPHARM.mint(admin.address, 100000);
            await tokenPHARM.mint(addr1.address, 100000);
            await tokenPHARM.connect(addr1).approve(dataStorage.address, 100000);

        });

        it("should allow an employer registration", async function () {
            await freePharma.connect(addr1).createEmployer();
            let employer = await freePharma.getOneEmployer(addr1.address);
            await expect(employer.created_at).to.not.equal(0);
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

            await freePharma.connect(addr2).createFreelancer();

            freelancerCount = await dataStorage.getFreelancerCount();
            assert.equal(freelancerCount.toString(), '1');
        });

        it("should allow a freelancer to apply for a job", async function () {
            await freePharma.connect(addr2).applyForJob(0);
            let job = await dataStorage.getJob(0);
            await expect(job.candidates[0]).to.equal(addr2.address);
        });

        it("should allow an employer to hire a applicant", async function () {
            await freePharma.connect(addr1).hireFreelancer(addr2.address, 0);
            let job = await dataStorage.getJob(0);

            let hiredList = await dataStorage.connect(addr1).getFreelancerJobHired(addr2.address);
            await expect(hiredList.length).to.equal(1);
            await expect(hiredList[0], ethers.utils.formatBytes32String("0"));
            await expect(job.status).to.equal(1);
        });

        it("should allow a freelancer to confirm his candidature", async function () {
            await freePharma.connect(addr2).confirmCandidature(0);
            let job = await dataStorage.jobs(0);
            await expect(job.status).to.equal(2);
            await expect(job.freelancerAddress).to.equal(addr2.address);
        });

        it("should allow a freelancer to indicate the job as completed", async function () {
            await freePharma.connect(addr2).completeFreelancerJob(0);
            let job = await dataStorage.getJob(0);
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
            let jobCount = await dataStorage.getJobCount();
            let freelancerCount = await dataStorage.getFreelancerCount();
            let employerCount = await dataStorage.getEmployerCount();

            let freelancer = await dataStorage.getFreelancer(addr2.address);
            await expect(freelancer.appliedJobIds.length).to.equal(0);
            await expect(freelancer.hiredJobIds.length).to.equal(0);
            await expect(freelancer.completedJobIds.length).to.equal(1);

            let employer = await dataStorage.getEmployer(addr1.address);
            await expect(employer.currentJobOffersIds.length).to.equal(0);
            await expect(employer.startedJobOffersIds.length).to.equal(0);
            await expect(employer.completedJobOffersIds.length).to.equal(1);
            

        });
    });
});
