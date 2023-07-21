const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Fetching accounts...");
    let [admin, employer1, employer2, employer3, ...freelancers] =
        await ethers.getSigners();

    /// contract deployment 
    console.log("Deploying contracts...");
    // PHARM token deployment
    const TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
    const tokenPHARM = await TokenPHARM.deploy();
    await tokenPHARM.deployed();

    // DataStorage deployment
    const DataStorage = await hre.ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.deploy(tokenPHARM.address);
    await dataStorage.deployed();

    // FreePharma deployment
    const FreePharma = await hre.ethers.getContractFactory("FreePharma");
    const freePharma = await FreePharma.deploy(
        dataStorage.address,
        tokenPHARM.address
    );
    await freePharma.deployed();

    // dataStorage configuration
    await dataStorage.setBusinessLogicContract(freePharma.address);

    // PriceProvider deployment
    let client = process.env.CLIENT_CHAIN;
    let priceProviderLabel = client != "hardhat" ? "PriceProvider": "MockPriceProvider";
    const PriceProvider = await hre.ethers.getContractFactory(priceProviderLabel);
    const priceProvider = await PriceProvider.deploy();
    await priceProvider.deployed();

    // StakingManager deployment
    const StakingManager = await hre.ethers.getContractFactory("StakingManager");
    const stakingManager = await StakingManager.deploy(
        tokenPHARM.address,
        priceProvider.address
    );
    await stakingManager.deployed();

    // Pre-minting of PHARM tokens
    console.log("PHARM Minting...");
    await tokenPHARM.mint(
        stakingManager.address,
        ethers.utils.parseEther("1000000000")
    );
    await tokenPHARM
        .connect(employer1)
        .approve(stakingManager.address, ethers.utils.parseEther("1000000000"));


    // log contract address
    console.log(`TokenPHARM deployed to ${tokenPHARM.address}`);
    console.log(`DataStorage deployed to ${dataStorage.address}`);
    console.log(`FreePharma deployed to ${freePharma.address}`);
    console.log(`${priceProviderLabel} deployed to ${priceProvider.address}`);
    console.log(`StakingManager deployed to ${stakingManager.address}`);
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
