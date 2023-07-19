// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceProvider is Ownable {

    /// Chainlink Price feeds
    AggregatorV3Interface public dataFeedETH;

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
}