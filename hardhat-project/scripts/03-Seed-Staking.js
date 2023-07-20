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
    await tokenPHARM.mint(
        stakingManager.address,
        ethers.utils.parseEther("1000000000")
    );
    await tokenPHARM.mint(
        employer1.address,
        ethers.utils.parseEther("1000000000")
    );
    await tokenPHARM
        .connect(employer1)
        .approve(stakingManager.address, ethers.utils.parseEther("1000000000"));

    /* ::::::::::::::: Stacking seeding table :::::::::::::::::: */

    /// - Account one is a staker
    ///     - Account one stake some tokens
    console.log("Deposits...");
    for (let i = 0; i < 60; i++) {
        let randomStackingAmount;
        var stakePHARM = Math.random() < 0.5;

        if (stakePHARM) {
            // random amount between 300 and 700
            randomStackingAmount = Math.floor(Math.random() * 401) + 300;
            await stakingManager
                .connect(employer1)
                .stakePHARM(
                    ethers.utils.parseEther(randomStackingAmount.toString())
                );
        } else {
            // random amount between 0.1 and 3
            randomStackingAmount = Math.random() * (3 - 0.1) + 0.1;
            await stakingManager
                .connect(employer1)
                .stakeETH({
                    value: ethers.utils.parseEther(
                        randomStackingAmount.toString()
                    ),
                });
        }
    }

    ///     - Account one unstake some tokens
    console.log("Withdrawal...");
    for (let i = 0; i < 60; i++) {
        let randomUnstackingAmount;
        var unstakePHARM = Math.random() < 0.5;

        if (unstakePHARM) {
            // random amount between 300 and 700
            randomStackingAmount = Math.floor(Math.random() * 401) + 300;
            await stakingManager
                .connect(employer1)
                .unstakePHARM(
                    ethers.utils.parseEther(randomStackingAmount.toString())
                );
        } else {
            // random amount between 0.001 and 3
            randomStackingAmount = Math.random() * (3 - 0.01) + 0.001;
            await stakingManager
                .connect(employer1)
                .unstakeETH(
                    ethers.utils.parseEther(randomStackingAmount.toString())
                );
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
