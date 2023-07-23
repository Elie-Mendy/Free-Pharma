const hre = require("hardhat");
require("dotenv").config();

async function main() {
    // get accounts
    console.log("Fetching accounts...");
    let [admin, employer1, employer2, employer3, ...freelancers] =
        await ethers.getSigners();

    // fetch contracts instances
    console.log("Fetching contracts instances...");
    const tokenPHARM = await hre.ethers.getContractAt(
        "TokenPHARM",
        process.env.TOKEN_PHARM_ADDRESS
    );

    const dataStorage = await hre.ethers.getContractAt(
        "DataStorage",
        process.env.DATA_STORAGE_ADDRESS
    );

    const freePharma = await hre.ethers.getContractAt(
        "FreePharma",
        process.env.FREE_PHARMA_ADDRESS
    );

    const priceProvider = await hre.ethers.getContractAt(
        "PriceProvider",
        process.env.PRICE_PROVIDER_ADDRESS
    );

    const stakingManager = await hre.ethers.getContractAt(
        "StakingManager",
        process.env.STAKING_MANAGER_ADDRESS
    );

    // PHARM Minting
    console.log("PHARM Minting...");
    await tokenPHARM.mint(employer1.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.mint(employer2.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.mint(employer3.address, ethers.utils.parseEther("1000000000"));
    
    // PHARM Approve
    console.log("PHARM Approve...");
    await tokenPHARM.connect(employer1).approve(freePharma.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.connect(employer1).approve(dataStorage.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.connect(employer2).approve(freePharma.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.connect(employer2).approve(dataStorage.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.connect(employer3).approve(freePharma.address, ethers.utils.parseEther("1000000000"));
    await tokenPHARM.connect(employer3).approve(dataStorage.address, ethers.utils.parseEther("1000000000"));


    /* :::::::::::::::  Free PHARMA Scenario :::::::::::::::::: */


    /// 1.  - Account one two and three are employers
    console.log("Creating employers...")
    await freePharma.connect(employer1).createEmployer("Sanofi", "sanofi@example.com", true );
    await freePharma.connect(employer2).createEmployer("Pfizer", "pfizer@example.com", true );
    await freePharma.connect(employer3).createEmployer("Boiron", "boiron@example.com", true );
 

    ///     - each employer create at least 10 jobs
    console.log("Creating jobs...")
    let startDate = new Date(2023, 0, 1); // January 1, 2023
    let endDate = new Date(2023, 2, 1); // January 1, 2023
    let startDateTimestamp = Math.floor(startDate.getTime() / 1000);
    let endDateTimestamp = Math.floor(endDate.getTime() / 1000);

    let cityList = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille"];

    for (let i = 0; i < 10; i++) {
        let randomStartDate = Math.floor(Math.random() * (endDateTimestamp - startDateTimestamp + 1)) + startDateTimestamp;
        let randomEndDate = Math.floor(Math.random() * (endDateTimestamp - randomStartDate + 1)) + randomStartDate;
        let randomCity = cityList[Math.floor(Math.random() * cityList.length)];
        let randomSalary = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        await freePharma.connect(employer1).createJob(randomStartDate, randomEndDate, randomSalary, randomCity);
        await freePharma.connect(employer2).createJob(randomStartDate, randomEndDate, randomSalary, randomCity);
        await freePharma.connect(employer3).createJob(randomStartDate, randomEndDate, randomSalary, randomCity);
    }


    /// 2.  - others accounts are freelancers
    console.log("Creating freelancers...")

    const pseudonymes = [
        'Alice.Q',  'Bob.M',   'Charlie.H',
        'David.Z',  'Ella.Y',  'Frank.K',
        'Grace.T',  'Henry.I', 'Isabel.G',
        'Jack.N',   'Kate.D',  'Liam.B',
        'Mia.R',    'Noah.X',  'Olivia.F',
        'Paul.O',   'Quinn.W', 'Ruby.P',
        'Sam.E',    'Tessa.L'
    ];
    
    // creates freelancers with random names
    for (let i = 0; i < freelancers.length; i++) {
        let randomPseudonyme = pseudonymes[Math.floor(Math.random() * pseudonymes.length)];
        let randomMail = randomPseudonyme.toLowerCase() + "@example.com";
        let randomCity = cityList[Math.floor(Math.random() * cityList.length)];
        let randomAverageDailyRate = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        let signer = await ethers.getSigner(freelancers[i].address);

        await freePharma.connect(signer).createFreelancer(
            randomPseudonyme,
            randomMail,
            randomCity,
            randomAverageDailyRate, 
            true, 
            true 
        );
    }

    ///     - each freelancer apply to at for jobs
    console.log("Applying for jobs...")
    let signerFreelancer1 = await ethers.getSigner(freelancers[0].address);
    let signerFreelancer2 = await ethers.getSigner(freelancers[1].address);
    let signerFreelancer3 = await ethers.getSigner(freelancers[2].address);
    let signerFreelancer4 = await ethers.getSigner(freelancers[3].address);

    await freePharma.connect(signerFreelancer1).applyForJob(0);
    await freePharma.connect(signerFreelancer1).applyForJob(1);
    await freePharma.connect(signerFreelancer1).applyForJob(2);

    await freePharma.connect(signerFreelancer2).applyForJob(0);
    await freePharma.connect(signerFreelancer2).applyForJob(1);
    await freePharma.connect(signerFreelancer2).applyForJob(2);

    await freePharma.connect(signerFreelancer3).applyForJob(0);
    await freePharma.connect(signerFreelancer3).applyForJob(1);
    await freePharma.connect(signerFreelancer3).applyForJob(2);

    await freePharma.connect(signerFreelancer4).applyForJob(0);
    await freePharma.connect(signerFreelancer4).applyForJob(1);
    await freePharma.connect(signerFreelancer4).applyForJob(2);

    /// 3.  - Some employers hire freelancers
    await freePharma.connect(employer1).hireFreelancer(0, freelancers[0].address);
    await freePharma.connect(employer2).hireFreelancer(1, freelancers[1].address);
    await freePharma.connect(employer3).hireFreelancer(2, freelancers[2].address);

    /// 4.  - Some Freelancers confirm their candidatures
    await freePharma.connect(signerFreelancer1).confirmCandidature(0);
    await freePharma.connect(signerFreelancer2).confirmCandidature(1);

    /// 5.  - Some Freelancers complete their jobs
    await freePharma.connect(signerFreelancer1).completeFreelancerJob(0);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
