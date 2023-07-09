const hre = require("hardhat");

async function main() {
    // fetching contract instance
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();

    // wait for contract to be deployed
    await simpleStorage.deployed();

    // log contract address
    console.log(`SimpleStorage deployed to ${simpleStorage.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
