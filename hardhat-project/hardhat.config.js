require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-contract-sizer");

// fetching configuration from .env file
const { INFURA_API_KEY, SEPOLIA_PRIVATE_KEY, GOERLI_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                details: { yul: false }
            },
        },
    },
    networks: {
        // local network
        hardhat: {
            blockGasLimit: 30000000, // Default 30_000_000
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
    },
    gasReporter: {
        enabled: false,
    },
};
