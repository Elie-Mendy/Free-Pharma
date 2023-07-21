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
    console.log(`TokenPHARM deployed to ${tokenPHARM.address}`);


    // DataStorage deployment
    const DataStorage = await hre.ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.deploy(tokenPHARM.address);
    await dataStorage.deployed();
    console.log(`DataStorage deployed to ${dataStorage.address}`);


    // FreePharma deployment
    const FreePharma = await hre.ethers.getContractFactory("FreePharma");
    const freePharma = await FreePharma.deploy(
        dataStorage.address,
        tokenPHARM.address
    );
    await freePharma.deployed();
    console.log(`FreePharma deployed to ${freePharma.address}`);

    // dataStorage configuration
    await dataStorage.setBusinessLogicContract(freePharma.address);

    // PriceProvider deployment
    let client = process.env.CLIENT_CHAIN;
    let priceProviderLabel =
        client != "hardhat" ? "PriceProvider" : "MockPriceProvider";
    const PriceProvider = await hre.ethers.getContractFactory(
        priceProviderLabel
    );
    const priceProvider = await PriceProvider.deploy();
    await priceProvider.deployed();
    console.log(`${priceProviderLabel} deployed to ${priceProvider.address}`);

    // StakingManager deployment
    const StakingManager = await hre.ethers.getContractFactory(
        "StakingManager"
    );
    const stakingManager = await StakingManager.deploy(
        tokenPHARM.address,
        priceProvider.address
    );
    await stakingManager.deployed();
    console.log(`StakingManager deployed to ${stakingManager.address}`);

    // Pre-minting of PHARM tokens
    console.log("PHARM Minting...");
    await tokenPHARM.mint(
        stakingManager.address,
        ethers.utils.parseEther("1000000000")
    );


    // Pre Approvals
    console.log("Approvals...");
    await tokenPHARM
        .connect(admin)
        .approve(stakingManager.address, ethers.utils.parseEther("10000"));

    await tokenPHARM
        .connect(admin)
        .approve(freePharma.address, ethers.utils.parseEther("1000000000"));


    // StakingManager configuration
    console.log("Setting MINTER_ROLE...");
    await tokenPHARM.grantRole(
        ethers.utils.id("MINTER_ROLE"),
        stakingManager.address
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
