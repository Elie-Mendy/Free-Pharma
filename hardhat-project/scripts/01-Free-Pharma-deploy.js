const hre = require("hardhat");

async function main() {
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

    // log contract address
    console.log(`TokenPHARM deployed to ${tokenPHARM.address}`);
    console.log(`SimpleStorage deployed to ${dataStorage.address}`);
    console.log(`FreePharma deployed to ${freePharma.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
