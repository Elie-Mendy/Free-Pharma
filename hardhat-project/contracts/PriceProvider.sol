// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceProvider is Ownable {

    /// Chainlink Price feeds
    AggregatorV3Interface internal dataFeedETH;

    /// @notice ETH/USD price feed
    constructor() {
        dataFeedETH = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    /// @notice Get the latest ETH/USD price
    /// @return the latest ETH/USD price
    function getLatestPriceETH() public view returns (int256) {
        (   /*uint80 roundID*/
            , int256 answer,
            , /*uint startedAt*/
            , /*uint timeStamp*/
            /*uint80 answeredInRound*/
            ) = dataFeedETH.latestRoundData();
        return answer;
    }

    /// @notice Set the data feed address for ETH/USD
    /// @param _pair the address of the ETH/USD price feed
    function setEthAddr(address _pair) external onlyOwner {
        dataFeedETH = AggregatorV3Interface(_pair);
    }
}


// sepolia addres : 0xA0b693E503f90Fcf3F0448652621fdBE78E18BE9