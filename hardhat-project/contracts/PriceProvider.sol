// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceProvider is Ownable {

    /// Chainlink Price feeds
    AggregatorV3Interface public dataFeedETH;

    /// @notice ETH/USD price feed
    constructor() {
        dataFeedETH = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); // sepolia
        //dataFeedETH = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e); // goerli
        //dataFeedETH = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A); // mumbai
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