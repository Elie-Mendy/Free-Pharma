// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PriceProvider.sol";

contract StackingManager is Ownable {

    /* ::::::::::::::: STATE :::::::::::::::::: */

    IERC20 tokenPHARM; // ERC20 PHARM token

    PriceProvider public priceProvider; // Price feed contract

    uint public lastBlockUpdateTime; 

    uint public APR = 800; // in bps -> 800 bps = 8% annual rate

    uint public ETHprice;                    // in USD
    uint public PHARMprice = 5 * 10 ** 17;   // 1 PHARM = 0.5 USD


    struct User {
        uint pendingRewards;   // in PHARM
        uint ethAmountStaked;   
        uint pharmAmountStaked;  
    }

    mapping(address => User) users;
    address[] userList;


    constructor(address _pharmAddress, address _priceProviderAddress) {
        // inject BYX address and price provider address in the deploy.
        tokenPHARM = IERC20(_pharmAddress);
        priceProvider = PriceProvider(_priceProviderAddress);
        lastBlockUpdateTime = block.timestamp;
    }


    /* ::::::::::::::: EVENTS :::::::::::::::::: */

    event StakePHARM(address indexed user, uint amount);
    event UnstakePHARM(address indexed user, uint amount);
    event StakeETH(address indexed user, uint amount);
    event UnstakeETH(address indexed user, uint amount);
    event RewardsClaimed(address indexed user, uint amount);
    event RewardsUpdated();

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    /// @notice Get User Info.
    /// @param _userAddress the address of the user.
    /// @return User memory.
    function getUser(address _userAddress) external view returns(User memory){
        return users[_userAddress];
    }


    /// @notice Stake PHARM tokens.
    /// @param _amount the amount of PHARM to stake.
    function stakePHARM(uint _amount) external {
        // for preventing DOS attack in the _updateRewards() function:
        // a user can only stake if he stakes more than 0.1 ETH
        require(_amount >= 100 * 10 ** 18, "PHARM: minimum stake amount is 100 PHARM.");
        require(tokenPHARM.balanceOf(msg.sender) >= _amount, "PHARM: insufficient balance.");
        require(tokenPHARM.allowance(msg.sender, address(this)) >= _amount, "PHARM: insufficient allowance.");
        _updateRewards();
        if(users[msg.sender].ethAmountStaked == 0 && users[msg.sender].pharmAmountStaked == 0) {
            userList.push(msg.sender);
        }
        tokenPHARM.transferFrom(msg.sender, address(this), _amount);
        users[msg.sender].pharmAmountStaked += _amount;
        emit StakePHARM(msg.sender,  _amount);
    }

    /// @notice Unstake PHARM tokens.
    /// @param _amount the amount of PHARM to unstake.
    function unstakePHARM(uint _amount) external {
        require(users[msg.sender].pharmAmountStaked >= _amount, "PHARM: insufficient staked amount.");
        _updateRewards();
        users[msg.sender].pharmAmountStaked -= _amount;
        tokenPHARM.transfer(msg.sender, _amount);
        emit UnstakePHARM(msg.sender,  _amount);
    }


    /// @notice Stake ETH.
    function stakeETH() external payable {
        // for preventing DOS attack in the _updateRewards() function:
        // a user can only stake if he stakes more than 0.1 ETH
        require(msg.value >= 1 * 10 ** 17, "ETH: minimum stake amount is 0.1 ETH.");
        _updateRewards();
        if(users[msg.sender].ethAmountStaked == 0 && users[msg.sender].pharmAmountStaked == 0) {
            userList.push(msg.sender);
        }
        users[msg.sender].ethAmountStaked += msg.value;
        emit StakeETH(msg.sender, msg.value);
    }

    /// @notice Unstake ETH.
    /// @param _amount the amount of ETH to unstake.
    function unstakeETH(uint _amount) external {
        _updateRewards();
        require(_amount <= users[msg.sender].ethAmountStaked, 'ETH: insufficient staked amount.');
        users[msg.sender].ethAmountStaked -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed.");
        emit UnstakeETH(msg.sender, _amount);
    }

    /// @notice Claim rewards.
    function claimRewards() external {
        _updateRewards();
        require(users[msg.sender].pendingRewards > 0, 'REWARD: you have no reward to claim.');
        uint _amount = users[msg.sender].pendingRewards;
        users[msg.sender].pendingRewards = 0;
        tokenPHARM.transfer(msg.sender, _amount);
        emit RewardsClaimed(msg.sender, _amount);
    }

    /// @notice Update ETH price.
    /// @dev fetching price from Chainlink oracle (cf : PriceFeed contract).
    function _updateETHprice() internal {
        ETHprice = uint(priceProvider.getLatestPriceETH());
    }

    /// @notice get the total ammount of tokens staked by a user (expressed in PHARM).
    /// @param _user the address of the user.
    /// @return the total amount of tokens staked by the user.
    function _getTotalStaked(address _user) internal view returns(uint) {
        return users[_user].ethAmountStaked * ETHprice / PHARMprice + users[_user].pharmAmountStaked ;
    }

    /// @notice get the time fratcion since last update.
    /// @return the time fraction since last update.
    function _getTimeFractionSinceLastUpdate() internal view returns(uint) {
        return (block.timestamp - lastBlockUpdateTime) / 1 days;
    }

    /// @notice Update rewards.
    function _updateRewards() internal {
        // update rewards only if it has not been updated for 1 day.
        if (block.timestamp > lastBlockUpdateTime + 1 days ) {
            _updateETHprice();
            uint timeFraction = _getTimeFractionSinceLastUpdate();
            // Risk for DDOS is minimum as potential attacker needs to stake ETH to add an entry in the array
            // Therefore, we add a minimum amount to stake to protect this potential vulnerability
            for (uint i = 0; i < userList.length; i++) {
                uint _newRewards = _getTotalStaked(userList[i]) * APR * timeFraction / 365 / 10000;
                users[userList[i]].pendingRewards += _newRewards;
            }
            lastBlockUpdateTime = block.timestamp;
            emit RewardsUpdated();
        }
    }
}