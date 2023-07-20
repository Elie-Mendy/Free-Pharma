const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

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
        await tokenPHARM.connect(addr1).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr2).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr3).approve(stakingManager.address, PHARM_PREFUND_SUPPLY);
        await tokenPHARM.connect(addr4).approve(stakingManager.address, PHARM_INSUFFICENT_ALLOWED_AMOUNT);
    });
    
    context("Function unit tests", () => {
        
        context('Staking', () => {

            describe("stakePHARM()", () => {
                
                it("should allow a user to stake PHARM tokens", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pharmAmountStaked.toString(), PHARM_SUFFICENT_AMOUNT.toString());
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
                    await time.increaseTo(await time.latest() + 24 * month);
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

                it("should not update the user's reward at the first staking", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.equal(user.pendingRewards, 0);
                });

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await time.increaseTo(await time.latest() + 24 * month);
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

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await time.increaseTo(await time.latest() + 24 * month);
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

                it("should update the user's reward if required time has passed since the last update", async function () {
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    await time.increaseTo(await time.latest() + 24 * month);
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
                    await time.increaseTo(await time.latest() + 12 * month);

                    await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await stakingManager.connect(addr1).claimRewards();
                    let currentBalance = await tokenPHARM.balanceOf(addr1.address);
                    assert.isTrue(currentBalance.gt(initialBalance));

                });

                it("should emit a RewardsClaimed event", async function () {
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    // time forwarding
                    await time.increaseTo(await time.latest() + 12 * month);
                    await expect(stakingManager.connect(addr1).claimRewards())
                        .to.emit(stakingManager, "RewardsClaimed")
                });
            });
            
        });

        context("Helpers", () => {

            describe("getUser()", () => {
                it("should return the right user's data", async function () {                   
                    await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
                    await time.increaseTo(await time.latest() + 1 * day);
                    await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
                    let user = await stakingManager.connect(addr1).getUser(addr1.address);
                    assert.notEqual(user.pendingRewards.toString(), '0');
                    assert.equal(user.ethAmountStaked, ETH_SUFFICENT_AMOUNT.toString());
                    assert.equal(user.pharmAmountStaked, PHARM_SUFFICENT_AMOUNT.toString());
                });

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
        it("should not update the reward before one day", async function () {
            await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
            await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
            await time.increaseTo(await time.latest() + 1 * hour);
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), '0');
        });

        it("should not update the reward after one day", async function () {
            await stakingManager.connect(addr1).stakePHARM(PHARM_SUFFICENT_AMOUNT);
            await stakingManager.connect(addr1).stakeETH({value: ETH_SUFFICENT_AMOUNT});
            await time.increaseTo(await time.latest() + 1 * day);
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), '0');
        });

        it("should aproximatively rewarding 80 PHARM tokens for 1000 PHARM staked on one year", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakePHARM(PHARM_SUFFICENT_AMOUNT);
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("80").toString());

        });

        it("should aproximatively rewarding 40 PHARM tokens for 1000 PHARM staked on six months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("39")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("41")));
        });

        it("should aproximatively rewarding 20 PHARM tokens for 1000 PHARM staked on three months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("1000"));
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("1000"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("19")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("21")));
        });

        it("should aproximatively rewarding 40 PHARM tokens for 500 PHARM staked on one year", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("40").toString());
        });

        it("should aproximatively rewarding 20 PHARM tokens for 500 PHARM staked on six months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("19")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("21")));
        });

        it("should aproximatively rewarding 10 PHARM tokens for 500 PHARM staked on three months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("500"));
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("500"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("9")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("11")));
        });

        it("should aproximatively rewarding 8 PHARM tokens for 100 PHARM staked on one year", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("8").toString());
        });

        it("should aproximatively rewarding 4 PHARM tokens for 100 PHARM staked on six months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("3")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("5")));
        });

        it("should aproximatively rewarding 2 PHARM tokens for 100 PHARM staked on three months", async function () {
            await stakingManager.connect(addr1).stakePHARM(ethers.utils.parseEther("100"));
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakePHARM(ethers.utils.parseEther("100"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("1")));
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("3")));
        });

        it("should aproximatively rewarding 3200 PHARM tokens for 10 ETH staked on one year", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("3200").toString());
        });

        it("should aproximatively rewarding 320 PHARM tokens for 1 ETH staked on one year", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("320").toString());
        });

        it("should aproximatively rewarding 32 PHARM tokens for 0.1 ETH staked on one year", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
            await time.increaseTo(await time.latest() + 1 * year);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.equal(user.pendingRewards.toString(), ethers.utils.parseEther("32").toString());
        });

        it("should aproximatively rewarding 1600 PHARM tokens for 10 ETH staked on six months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("1600")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("1575")));
        });

        it("should aproximatively rewarding 160 PHARM tokens for 1 ETH staked on six months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("160")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("157")));
        });

        it("should aproximatively rewarding 16 PHARM tokens for 0.1 ETH staked on six months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
            await time.increaseTo(await time.latest() + 6 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("16")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("15")));
        });

        it("should aproximatively rewarding 800 PHARM tokens for 10 ETH staked on three months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("10")});
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("10"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("800")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("775")));
        });

        it("should aproximatively rewarding 80 PHARM tokens for 1 ETH staked on three months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("1")});
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("80")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("77")));
        });

        it("should aproximatively rewarding 8 PHARM tokens for 0.1 ETH staked on three months", async function () {
            await stakingManager.connect(addr1).stakeETH({value: ethers.utils.parseEther("0.1")});
            await time.increaseTo(await time.latest() + 3 * month);
            await stakingManager.connect(addr1).unstakeETH(ethers.utils.parseEther("0.1"));
            let user = await stakingManager.connect(addr1).getUser(addr1.address);
            assert.isTrue(user.pendingRewards.lt(ethers.utils.parseEther("8")));
            assert.isTrue(user.pendingRewards.gt(ethers.utils.parseEther("7")));
        });

    });

});
