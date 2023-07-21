const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { minutes, seconds, years, days } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration");

describe("StakingManager", function (accounts) {
    let tokenPHARM, priceProvider, stakingManager;
    let admin, addr1, addr2, addr3, addr4, unknown, addresses;

    
    /* ::::::::::::::: STATE :::::::::::::::::: */

    const PHARM_STAKING_REWARDS_SUPPLY      = ethers.utils.parseEther("20000000"); // 20 000 000 PHARM

    const PHARM_PREFUND_SUPPLY              = ethers.utils.parseEther("10000");    // 10 000 PHARM
    const PHARM_SUFFICENT_AMOUNT            = ethers.utils.parseEther("1000");     // 1000 PHARM
    const PHARM_INSUFFICENT_AMOUNT          = ethers.utils.parseEther("10");       // 10 PHARM
    const PHARM_INSUFFICENT_ALLOWED_AMOUNT  = ethers.utils.parseEther("90");       // 90 PHARM

    const ETH_SUFFICENT_AMOUNT              = ethers.utils.parseEther("1");        // 1 ETH
    const ETH_INSUFFICENT_AMOUNT            = ethers.utils.parseEther("0.01");      // 0.01 ETH

    const year                    = 31536000;                    // 1 year in seconds
    const month                   = 2592000;                     // 1 month in seconds
    const week                    = 604800;                      // 1 week in seconds
    const day                     = 86400;                       // 1 day in seconds
    const hour                    = 3600;                        // 1 hour in seconds

    // Contracts deployment
    beforeEach(async function () {
        // fetch accounts once, instanciation of all those variables
        [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
        await ethers.getSigners();

        // PHARM token deployment
        let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
        tokenPHARM = await TokenPHARM.deploy();

        // PriceProvider deployment
        let PriceProvider = await hre.ethers.getContractFactory("MockPriceProvider");
        priceProvider = await PriceProvider.deploy();


        // stakingManager deployment
        let StakingManager = await hre.ethers.getContractFactory("StakingManager");
        stakingManager = await StakingManager.deploy(tokenPHARM.address, priceProvider.address);

        // Pre-minting of PHARM tokens
        await tokenPHARM.mint(stakingManager.address, PHARM_STAKING_REWARDS_SUPPLY);
        await tokenPHARM.mint(addr1.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.mint(addr2.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.mint(addr3.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.mint(addr4.address, PHARM_PREFUND_SUPPLY);

        // setting PHARM approval for stakingManager
        await tokenPHARM.grantRole(await tokenPHARM.MINTER_ROLE(), stakingManager.address);
        await tokenPHARM.connect(addr1).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr2).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr3).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr4).approve(stakingManager.address, PHARM_INSUFFICENT_ALLOWED_AMOUNT);

    });

    /* ::::::::::::::: TESTS :::::::::::::::::: */

    context("Deployment", () => {
        it ("should have the minter role", async function () {
            assert.isTrue(await tokenPHARM.hasRole(await tokenPHARM.MINTER_ROLE(), stakingManager.address));
        });

        it ("should be deployed without value stacked", async function () {
            let PHARMtotalValueLocked = await stakingManager.PHARMtotalValueLocked();
            let ETHtotalValueLocked = await stakingManager.ETHtotalValueLocked();

            assert.equal(PHARMtotalValueLocked, 0);
            assert.equal(ETHtotalValueLocked, 0);
            assert.equal(await stakingManager.getTotalValueLocked(), 0);
        });

        it("should be deployed in production mode", async function () {
            let demoMode = await stakingManager.DemoMode();
            assert.isFalse(demoMode);
        });
    });
    
    context("Function unit tests", () => {
        
        context('Staking', () => {

            describe("stakePHARM()", () => {
                
                it("should allow a user to stake PHARM tokens", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pharmAmountStaked.toString(), PHARM_SUFFICENT_AMOUNT.toString());
                });

                it("should update the PHARMtotalValueLocked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let PHARMtotalValueLocked = await stakingManager.PHARMtotalValueLocked();
                    assert.equal(PHARMtotalValueLocked.toString(), PHARM_SUFFICENT_AMOUNT.toString());
                });

                it("should not update the user's reward at the first staking", async function () {
                    await tokenPHARM.mint(addr1.address, PHARM_SUFFICENT_AMOUNT);
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);

                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pendingRewards, 0);
                });

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await tokenPHARM.mint(addr1.address, PHARM_SUFFICENT_AMOUNT);
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await time.increaseTo(await time.latest() + years(2));
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.notEqual(user.pendingRewards, 0);
                });

                it("should forbid a user to stake an unsuficient amount of PHARM tokens", async function () {
                    await expect(stakingManager.connect(addr1).stakePHARM(PHARM_INSUFFICENT_AMOUNT))
                        .to.be.revertedWith("PHARM: minimum stake amount is 100 PHARM.");
                });

                it("should forbid a user to stake more PHARM tokens than he has", async function () {
                    await expect(stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT + "1"))
                        .to.be.revertedWith("PHARM: insufficient balance.");
                });

                it("should forbid a user to stake more PHARM tokens than he allowed the contract to transfer", async function () {
                    await expect(stakingManager.connect(addr4).stakePHARM(PHARM_PREFUND_SUPPLY))
                        .to.be.revertedWith("PHARM: insufficient allowance.");
                });

                it("should emit a StakePHARM event", async function () {
                    await expect(stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT))
                        .to.emit(stakingManager, "StakePHARM")
                });
            });

            describe("stakeETH()", () => {
                it("should allow a user to stake ETH tokens", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.ethAmountStaked.toString(), ETH_SUFFICENT_AMOUNT.toString());
                });

                it("should update the ETHtotalValueLocked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let ETHtotalValueLocked = await stakingManager.ETHtotalValueLocked();
                    assert.equal(ETHtotalValueLocked.toString(), ETH_SUFFICENT_AMOUNT.toString());
                });

                it("should not update the user's reward at the first staking", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pendingRewards, 0);
                });

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await time.increaseTo(await time.latest() + years(2));
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.notEqual(user.pendingRewards, 0);
                });

                it("should forbid a user to stake an unsuficient amount of ETH tokens", async function () {
                    await expect(stakingManager.connect(addr1).stakeETH({value: ETH_INSUFFICENT_AMOUNT.toString()}))
                        .to.be.revertedWith("ETH: minimum stake amount is 0.1 ETH.");
                });

                it("should emit a StakeETH event", async function () {
                    await expect(stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT}))
                        .to.emit(stakingManager, "StakeETH")
                });
            });

        });

        context('Unstaking', () => {

            describe("unstakePHARM()", () => {
                it("should allow a user to unstake PHARM tokens", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pharmAmountStaked, 0);
                    assert.equal(await tokenPHARM.balanceOf(addr1.address), PHARM_PREFUND_SUPPLY.toString());
                });

                it("should update the PHARMtotalValueLocked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let PHARMtotalValueLocked = await stakingManager.PHARMtotalValueLocked();
                    assert.equal(PHARMtotalValueLocked.toString(), PHARM_SUFFICENT_AMOUNT.toString());

                    await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                    PHARMtotalValueLocked = await stakingManager.PHARMtotalValueLocked();
                    assert.equal(PHARMtotalValueLocked.toString(), 0);
                });

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await time.increaseTo(await time.latest() + years(2));
                    await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                    
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.notEqual(user.pendingRewards, 0);
                });

                it("should forbid a user to unstake more PHARM tokens than he has staked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await expect(stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT + "1"))
                        .to.be.revertedWith("PHARM: insufficient staked amount.");
                });
                
                it("should emit a UnstakePHARM event", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await expect(stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT))
                        .to.emit(stakingManager, "UnstakePHARM")
                });
            });

            describe("unstakeETH()", () => {
                it("should allow a user to unstake ETH tokens", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});

                    let balanceBefore = await addr1.getBalance();

                    await stakingManager.connect(addr1).unstakeETH(ETH_SUFFICENT_AMOUNT);

                    let balanceAfter = await addr1.getBalance();
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);

                    assert.equal(user.ethAmountStaked, 0);
                    assert.isTrue(balanceAfter.gt(balanceBefore));
                });

                it("should update the ETHtotalValueLocked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let ETHtotalValueLocked = await stakingManager.ETHtotalValueLocked();
                    assert.equal(ETHtotalValueLocked.toString(), ETH_SUFFICENT_AMOUNT.toString());

                    await stakingManager.connect(addr1).unstakeETH(ETH_SUFFICENT_AMOUNT);
                    ETHtotalValueLocked = await stakingManager.ETHtotalValueLocked();
                    assert.equal(ETHtotalValueLocked.toString(), 0);
                });


                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await time.increaseTo(await time.latest() + years(2));
                    await stakingManager.connect(addr1).unstakeETH(ETH_SUFFICENT_AMOUNT);
                    
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.notEqual(user.pendingRewards, 0);
                });

                it("should forbid a user to unstake more ETH tokens than he has staked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await expect(stakingManager.connect(addr1).unstakeETH(ETH_SUFFICENT_AMOUNT + "1"))
                        .to.be.revertedWith("ETH: insufficient staked amount.");
                });

                it("should emit a UnstakeETH event", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await expect(stakingManager.connect(addr1).unstakeETH(ETH_SUFFICENT_AMOUNT))
                        .to.emit(stakingManager, "UnstakeETH")
                });
            });

        });

        context('Rewards', () => {

            describe("claimRewards()", () => {
                it("should allow a user to claim his rewards", async function () {
                    let initialBalance = await tokenPHARM.balanceOf(addr1.address);
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);

                    // time forwarding
                    await time.increaseTo(await time.latest() + years(2));

                    await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await stakingManager.connect(addr1).claimRewards();
                    let currentBalance = await tokenPHARM.balanceOf(addr1.address);
                    assert.isTrue(currentBalance.gt(initialBalance));

                });

                it("should forbid a user to claim his rewards if he has no rewards", async function () {
                    await expect(stakingManager.connect(addr1).claimRewards())
                        .to.be.revertedWith("REWARD: you have no reward to claim.");
                });

                it("should emit a RewardsClaimed event", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    // time forwarding
                    await time.increaseTo(await time.latest() + years(2));
                    await expect(stakingManager.connect(addr1).claimRewards())
                        .to.emit(stakingManager, "RewardsClaimed")
                });
            });
            
        });
        
        context("Helpers", () => {

            describe("DemoMode()", () => {
                it("should return true", async function () {
                    let demoMode = await stakingManager.DemoMode();
                    assert.isFalse(demoMode);
                });

                it("should return false", async function () {
                    await stakingManager.switchDemoMode();
                    let demoMode = await stakingManager.DemoMode();
                    assert.isTrue(demoMode);
                });
            });

            describe("lastBlockUpdateTime()", () => {
                it("should return the last block timestamp", async function () {
                    let blockUpdateTime = await stakingManager.lastBlockUpdateTime();
                    await time.increaseTo(await time.latest() + days(1));
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let lastBlockUpdateTime = await stakingManager.lastBlockUpdateTime();
                    assert.isTrue(lastBlockUpdateTime.gt(blockUpdateTime));
                });
            });

            describe("APR()", () => {
                it("should return the right APR", async function () {
                    let apr = await stakingManager.APR();
                    assert.equal(apr.toString(), "500");
                });
            });

            describe("ETHprice()", () => {
                it("should return the right ETH price", async function () {
                    let ethPrice = await stakingManager.ETHprice();
                    assert.equal(ethPrice.toString(), ethers.utils.parseEther("2000").toString());
                });
            });

            describe("PHARMprice()", () => {
                it("should return the right PHARM price", async function () {
                    let pharmPrice = await stakingManager.PHARMprice();
                    assert.equal(pharmPrice.toString(), ethers.utils.parseEther("0.50").toString());
                });
            });

            describe("PHARMtotalValueLocked()", () => {
                it("should return the right PHARM total value locked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let PHARMtotalValueLocked = await stakingManager.PHARMtotalValueLocked();
                    assert.equal(PHARMtotalValueLocked.toString(), PHARM_SUFFICENT_AMOUNT.toString());
                });
            });

            describe("ETHtotalValueLocked()", () => {
                it("should return the right ETH total value locked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let ETHtotalValueLocked = await stakingManager.ETHtotalValueLocked();
                    assert.equal(ETHtotalValueLocked.toString(), ETH_SUFFICENT_AMOUNT.toString());
                });
            });

            describe("getTotalStaked()", () => {
                it("should return the right total staked for only PHARM staked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let totalStaked = await stakingManager.getTotalValueLocked();
                    assert.equal(totalStaked.toString(), PHARM_SUFFICENT_AMOUNT.toString());
                });

                it("should return the right total staked for only ETH staked", async function () {
                    // 1 ETH = 2000 USD = 4000 PHARM
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let totalStaked = await stakingManager.getTotalValueLocked();
                    assert.equal(totalStaked.toString(), ethers.utils.parseEther("4000").toString());
                });

                it("should return the right total staked", async function () {
                    // 1 ETH = 2000 USD = 4000 PHARM
                    await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                    await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                    let totalStaked = await stakingManager.getTotalValueLocked();
                    let waitedValue = ethers.utils.parseEther("5000");
                    assert.equal(totalStaked.toString(), waitedValue.toString());
                });
            });

            describe("getPercentageOfTotalStaked()", () => {
                it("should return the right percentage of total staked for only PHARM staked", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let percentageOfTotalStaked = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    assert.equal(percentageOfTotalStaked.toString(), "100");

                    await stakingManager.connect(addr2).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    percentageOfTotalStaked = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    let percentageOfTotalStaked2 = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    assert.equal(percentageOfTotalStaked.toString(), "50");
                    assert.equal(percentageOfTotalStaked2.toString(), "50");
                });
                
                it("should return the right percentage of total staked for only ETH staked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let percentageOfTotalStaked = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    assert.equal(percentageOfTotalStaked.toString(), "100");

                    await stakingManager.connect(addr2).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    percentageOfTotalStaked = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    let percentageOfTotalStaked2 = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    assert.equal(percentageOfTotalStaked.toString(), "50");
                    assert.equal(percentageOfTotalStaked2.toString(), "50");
                });

                it("should return the right percentage of total staked", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                    await stakingManager.connect(addr2).stakePHARM(ethers.utils.parseEther("1000"));
                    let percentageOfTotalStaked = await stakingManager.getPercentageOfTotalStaked(addr1.address);
                    assert.equal(percentageOfTotalStaked.toString(), "80");

                    let percentageOfTotalStaked2 = await stakingManager.getPercentageOfTotalStaked(addr2.address);
                    assert.equal(percentageOfTotalStaked2.toString(), "20");
                });
            });

            describe("getBonusCoefficient()", () => {
                /// NOTA 
                ///    percentage < 1% : bonus = 0
                ///    1% <= percentage < 2% : bonus = 1%
                ///    2% <= percentage < 3% : bonus = 2%
                ///    percentage >=5% : bonus = 3%
                
                it("should return no bonus coefficient if percentage TVL < 1%", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("4")});
                    await stakingManager.connect(addr2).stakePHARM(ethers.utils.parseEther("100"));

                    // resultat in bps
                    let bonusCoefficient = await stakingManager.getBonusCoefficient(addr2.address);
                    assert.equal(bonusCoefficient.toString(), "0");
                });const { ethers } = require("hardhat");
                const { expect, assert } = require("chai");
                const { time } = require("@nomicfoundation/hardhat-network-helpers");
                
                
                
                it("should not return emply values for an unexisting user's data", async function () {               
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pendingRewards.toString(), '0');
                    assert.equal(user.ethAmountStaked, 0);
                    assert.equal(user.pharmAmountStaked, 0);
                });
            }); 
        });
    });
    
    
    context('Reward Fuzzing', () => {

        context("Production Mode - rewards per year", () => {
            it("should not update the reward before one day", async function () {
                await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                await time.increaseTo(await time.latest() + 1 * hour);
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), '0');
            });
    
            it("should update the reward after one day", async function () {
                await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                await time.increaseTo(await time.latest() + 2 * day);
                await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});

                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.notEqual(user.pendingRewards.toString(), '0');
            });
    
            it("should aproximatively rewarding 80 PHARM tokens for 1000 PHARM staked on one year", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("80").toString());
    
            });
            
            it("should aproximatively rewarding 40 PHARM tokens for 1000 PHARM staked on six months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + years(1) / 2);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("39")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("40")));
            });
    
            it("should aproximatively rewarding 20 PHARM tokens for 1000 PHARM staked on three months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("19.5")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("20")));
            });
    
            it("should aproximatively rewarding 40 PHARM tokens for 500 PHARM staked on one year", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("40").toString());
            });
    
            it("should aproximatively rewarding 20 PHARM tokens for 500 PHARM staked on six months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + years(1) /2);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("19.5")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("20")));
            });
    
            it("should aproximatively rewarding 10 PHARM tokens for 500 PHARM staked on three months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("9")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("11")));
            });
    
            it("should aproximatively rewarding 8 PHARM tokens for 100 PHARM staked on one year", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("8").toString());
            });
    
            it("should aproximatively rewarding 4 PHARM tokens for 100 PHARM staked on six months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + years(1) /2);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("3.5")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("4")));
            });
    
            it("should aproximatively rewarding 2 PHARM tokens for 100 PHARM staked on three months", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("1.5")));
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("2")));
            });
    
            it("should aproximatively rewarding 3200 PHARM tokens for 10 ETH staked on one year", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("3200").toString());
            });
    
            it("should aproximatively rewarding 320 PHARM tokens for 1 ETH staked on one year", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("320").toString());
            });
    
            it("should aproximatively rewarding 32 PHARM tokens for 0.1 ETH staked on one year", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + years(1));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("32").toString());
            });
    
            it("should aproximatively rewarding 1600 PHARM tokens for 10 ETH staked on six months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + years(1) /2);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("1600")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("1590")));
            });
    
            it("should aproximatively rewarding 160 PHARM tokens for 1 ETH staked on six months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + years(1) /2);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("160")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("159")));
            });
    
            it("should aproximatively rewarding 16 PHARM tokens for 0.1 ETH staked on six months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + years(1) /2);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("16")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("15.9")));
            });
    
            it("should aproximatively rewarding 800 PHARM tokens for 10 ETH staked on three months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("800")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("795")));
            });
    
            it("should aproximatively rewarding 80 PHARM tokens for 1 ETH staked on three months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("80")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("79.5")));
            });
    
            it("should aproximatively rewarding 8 PHARM tokens for 0.1 ETH staked on three months", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + years(1) /4);
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("8")));
                assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("7.95")));
            });
        });

        context("Debug Mode - rewards per minute", () => {
            beforeEach(async function () {
                // set DebugMode to true
                await stakingManager.switchDemoMode();
            });
            
            it("should aproximatively rewarding 80 PHARM tokens for 1000 PHARM staked on one minute", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + seconds(59));
                await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("80").toString());

            });
            
            it("should aproximatively rewarding 40 PHARM tokens for 1000 PHARM staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("40").toString());

            });

            it("should aproximatively rewarding 20 PHARM tokens for 1000 PHARM staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("20").toString());

            });

            it("should aproximatively rewarding 40 PHARM tokens for 500 PHARM staked on one minute", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + seconds(59) );
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("40").toString());
            });

            it("should aproximatively rewarding 20 PHARM tokens for 500 PHARM staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("20").toString());

            });

            it("should aproximatively rewarding 10 PHARM tokens for 500 PHARM staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("10").toString());

            });

            it("should aproximatively rewarding 8 PHARM tokens for 100 PHARM staked on one minute", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + seconds(59) );
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("8").toString());
            });

            it("should aproximatively rewarding 4 PHARM tokens for 100 PHARM staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("4").toString());
            });

            it("should aproximatively rewarding 2 PHARM tokens for 100 PHARM staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("2").toString());
            });

            it("should aproximatively rewarding 3200 PHARM tokens for 10 ETH staked on one minute", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + seconds(59) );
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("3200").toString());
            });

            it("should aproximatively rewarding 320 PHARM tokens for 1 ETH staked on one minute", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + seconds(59) );
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("320").toString());
            });

            it("should aproximatively rewarding 32 PHARM tokens for 0.1 ETH staked on one minute", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + seconds(59) );
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("32").toString());
            });

            it("should aproximatively rewarding 1600 PHARM tokens for 10 ETH staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("1600").toString());

            });

            it("should aproximatively rewarding 160 PHARM tokens for 1 ETH staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("160").toString());

            });

            it("should aproximatively rewarding 16 PHARM tokens for 0.1 ETH staked on 30 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + seconds(29));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("16").toString());

            });

            it("should aproximatively rewarding 800 PHARM tokens for 10 ETH staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("800").toString());
            });

            it("should aproximatively rewarding 80 PHARM tokens for 1 ETH staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("80").toString());
            });

            it("should aproximatively rewarding 8 PHARM tokens for 0.1 ETH staked on 15 secondes", async function () {
                await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
                await time.increaseTo(await time.latest() + seconds(14));
                await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
                let user = await stakingManager.connect(addr1).getUser(addr1.address);
                assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("8").toString());
            });
        });

    });
    

});
