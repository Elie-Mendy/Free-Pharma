const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("PriceProvider", function (accounts) {
    let priceProvider;

    // Contracts deployment
    beforeEach(async function () {
        // fetch accounts once, instanciation of all those variables
        [admin, addr1, addr2, addr3, addr4, unknown, addresses] =
        await ethers.getSigners();

        // PHARM token deployment
        let TokenPHARM = await hre.ethers.getContractFactory("TokenPHARM");
        tokenPHARM = await TokenPHARM.deploy();

        // PriceProvider deployment
        let PriceProvider = await hre.ethers.getContractFactory("PriceProvider");
        priceProvider = await PriceProvider.deploy();
        let MockPriceProvider = await hre.ethers.getContractFactory("MockPriceProvider");
        mockPpriceProvider = await MockPriceProvider.deploy();
    });
    
    context("Deployment", () => {
        
        describe("getLatestPriceETH()", () => {

            it("Should be deployed with the right owner", async () => {
                let owner = await priceProvider.owner();
                assert.equal(owner, admin.address);
            });

        });

    });

    context("Function unit tests", () => {

        describe("getLatestPriceETH()", () => {

            it("Should return the latest price of ETH in USD", async () => {
                let ETHprice = await mockPpriceProvider.getLatestPriceETH();
                assert.equal(ETHprice.toString(), ethers.utils.parseEther("2000").toString());
            });

        });

        describe("dataFeedETH()", () => {
            it("Should return the dataFeed's address", async () => {
                let dataFeed = await priceProvider.dataFeedETH();
                assert.equal(dataFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306");
            });
        });




    });

});
