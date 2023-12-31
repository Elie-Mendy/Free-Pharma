// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockedPriceProvider
 * @author Elie MENDY
 * @notice This contract is a mocked contract of PriceProvider.sol
 * @notice because PriceProvider.sol can only work either on a main or test network or a main, we use that contract only for local testing purpose.
 */
contract MockPriceProvider {

    /// @notice Get the latest ETH/USD price
    /// @return the latest ETH/USD price
    function getLatestPriceETH() public pure returns (int256) {
        // arbitrary value for testing purpose
        return 200000000000 * 10 ** 10;
    }
}