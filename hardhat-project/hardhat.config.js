require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-contract-sizer");
require("solidity-coverage");
require("hardhat-docgen");

// fetching configuration from .env file
const { INFURA_API_KEY, SEPOLIA_PRIVATE_KEY, GOERLI_PRIVATE_KEY, ALCHEMY_API_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                details: { yul: false },
            },
        },
    },
    networks: {
        // local network
        hardhat: {
            blockGasLimit: 30000000, // Default 30_000_000
            gas: 2100000,
            gasPrice: 8000000000,
        },
        // testnet network
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [GOERLI_PRIVATE_KEY],
        },
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [GOERLI_PRIVATE_KEY],
        },
    },
    gasReporter: {
        enabled: false,
    },
    docgen: {
        path: "./docs",
        clear: true,
        runOnCompile: true,
    },
};
