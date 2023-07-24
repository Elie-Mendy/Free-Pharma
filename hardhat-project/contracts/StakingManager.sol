// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PHARM.sol";
import "./PriceProvider.sol";

contract StakingManager is Ownable {
    /* ::::::::::::::: STATE :::::::::::::::::: */

    // for testing purpose only : the computation will be based on minutes instead of years

    TokenPHARM tokenPHARM; // ERC20 PHARM token

    PriceProvider internal priceProvider; // Price feed contract

    bool public DemoMode = false; // for testing purpose only : the computation will be based on minutes instead of years

    uint public lastBlockUpdateTime; // timestamp of the last update

    uint public APR = 500; // in bps -> 800 bps = 8% annual rate

    uint public ETHprice; // in USD
    uint public PHARMprice = 5 * 10 ** 17; // 1 PHARM = 0.5 USD

    uint public PHARMtotalValueLocked;
    uint public ETHtotalValueLocked;

    struct User {
        uint pendingRewards; // in PHARM
        uint ethAmountStaked;
        uint pharmAmountStaked;
    }

    mapping(address => User) users;
    address[] userList;

    constructor(address _pharmAddress, address _priceProviderAddress) {
        // inject BYX address and price provider address in the deploy.
        tokenPHARM = TokenPHARM(_pharmAddress);
        priceProvider = PriceProvider(_priceProviderAddress);
        ETHprice = uint(priceProvider.getLatestPriceETH());
        lastBlockUpdateTime = block.timestamp;
    }

    /* ::::::::::::::: EVENTS :::::::::::::::::: */

    event StakePHARM(address indexed userAddress, uint amount, uint timestamp);
    event UnstakePHARM(
        address indexed userAddress,
        uint amount,
        uint timestamp
    );
    event StakeETH(address indexed userAddress, uint amount, uint timestamp);
    event UnstakeETH(address indexed userAddress, uint amount, uint timestamp);
    event RewardsClaimed(
        address indexed userAddress,
        uint amount,
        uint timestamp
    );
    event RewardsUpdated();
    event DemoModeSwitched();

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    /// @notice switch the DemoMode variable.
    /// @dev only the owner can call this function.
    function switchDemoMode() external onlyOwner {
        DemoMode = !DemoMode;
        emit DemoModeSwitched();
    }

    /// @notice Get User Info.
    /// @param _userAddress the address of the user.
    /// @return User memory.
    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }

    /// @notice Stake PHARM tokens.
    /// @param _amount the amount of PHARM to stake.
    function stakePHARM(uint _amount) external {
        // for preventing DOS attack in the _updateRewards() function:
        // a user can only stake if he stakes more than 0.1 ETH
        if (_amount < 100 * 10 ** 18) {
            revert("PHARM: minimum stake amount is 100 PHARM.");
        }
        if (tokenPHARM.balanceOf(msg.sender) < _amount) {
            revert("PHARM: insufficient balance.");
        }
        if (tokenPHARM.allowance(msg.sender, address(this)) < _amount) {
            revert("PHARM: insufficient allowance.");
        }
        _updateRewards();
        if (
            users[msg.sender].ethAmountStaked == 0 &&
            users[msg.sender].pharmAmountStaked == 0
        ) {
            userList.push(msg.sender);
        }
        tokenPHARM.transferFrom(msg.sender, address(this), _amount);
        users[msg.sender].pharmAmountStaked += _amount;
        PHARMtotalValueLocked += _amount;
        emit StakePHARM(msg.sender, _amount, block.timestamp);
    }

    /// @notice Unstake PHARM tokens.
    /// @param _amount the amount of PHARM to unstake.
    function unstakePHARM(uint _amount) external {
        if (users[msg.sender].pharmAmountStaked < _amount) {
            revert("PHARM: insufficient staked amount.");
        }
        _updateRewards();
        PHARMtotalValueLocked -= _amount;
        users[msg.sender].pharmAmountStaked -= _amount;
        tokenPHARM.transfer(msg.sender, _amount);
        emit UnstakePHARM(msg.sender, _amount, block.timestamp);
    }

    /// @notice Stake ETH.
    function stakeETH() external payable {
        // for preventing DOS attack in the _updateRewards() function:
        // a user can only stake if he stakes more than 0.1 ETH
        if (msg.value < 1 * 10 ** 17) {
            revert("ETH: minimum stake amount is 0.1 ETH.");
        }
        _updateRewards();
        if (
            users[msg.sender].ethAmountStaked == 0 &&
            users[msg.sender].pharmAmountStaked == 0
        ) {
            userList.push(msg.sender);
        }
        users[msg.sender].ethAmountStaked += msg.value;
        ETHtotalValueLocked += msg.value;
        emit StakeETH(msg.sender, msg.value, block.timestamp);
    }

    /// @notice Unstake ETH.
    /// @param _amount the amount of ETH to unstake.
    function unstakeETH(uint _amount) external {
        _updateRewards();
        if (_amount > users[msg.sender].ethAmountStaked) {
            revert("ETH: insufficient staked amount.");
        }
        users[msg.sender].ethAmountStaked -= _amount;
        ETHtotalValueLocked -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed.");
        emit UnstakeETH(msg.sender, _amount, block.timestamp);
    }

    /// @notice Claim rewards.
    function claimRewards() external {
        _updateRewards();
        if (users[msg.sender].pendingRewards == 0) {
            revert("REWARD: you have no reward to claim.");
        }
        uint _amount = users[msg.sender].pendingRewards;
        users[msg.sender].pendingRewards = 0;
        tokenPHARM.mint(msg.sender, _amount);
        emit RewardsClaimed(msg.sender, _amount, block.timestamp);
    }

    /// @notice Update ETH price.
    /// @dev fetching price from Chainlink oracle (cf : PriceFeed contract).
    function _updateETHprice() internal {
        ETHprice = uint(priceProvider.getLatestPriceETH());
    }

    /// @notice get the total value locked in the contract (expressed in USD).
    /// @return the total value locked in the contract.
    function getTotalValueLocked() public view returns (uint) {
        return
            (ETHtotalValueLocked * ETHprice) /
            PHARMprice +
            PHARMtotalValueLocked;
    }

    /// @notice get the total ammount of tokens staked by a user (expressed in PHARM).
    /// @param _user the address of the user.
    /// @return the total amount of tokens staked by the user.
    function _getUserTotalStaked(address _user) internal view returns (uint) {
        return
            (users[_user].ethAmountStaked * ETHprice) /
            PHARMprice +
            users[_user].pharmAmountStaked;
    }

    /// @notice get the percentage of the total value locked staked by a user.
    /// @param _user the address of the user.
    /// @return the percentage of the total value locked staked by the user.
    function getPercentageOfTotalStaked(
        address _user
    ) public view returns (uint) {
        uint totalValueLocked = getTotalValueLocked();
        // if totalValueLocked is 0, return 0 to avoid division by 0
        if (totalValueLocked == 0) {
            return 0;
        }
        // else return the percentage of the total value locked staked by the user
        return (_getUserTotalStaked(_user) * 100) / totalValueLocked;
    }

    /// @notice get the bonus coefficient for a user depending on the percentage of the total value locked staked by the user.
    /// @param _user the address of the user.
    /// @return the bonus coefficient for the user.
    function getBonusCoefficient(address _user) public view returns (uint) {
        // get the percentage of the total value locked staked by the user
        uint percentage = getPercentageOfTotalStaked(_user);
        // define the bonus coefficient depending on the percentage
        /* NOTA 
            percentage < 1% : bonus = 0
            1% <= percentage < 2% : bonus = 1%
            2% <= percentage < 3% : bonus = 2%
            percentage >=5% : bonus = 3%
        */
        if (percentage < 1) {
            return 0;
        } else if (percentage <= 2) {
            return 100;
        } else if (percentage <= 5) {
            return 200;
        } else {
            return 300;
        }
    }

    /// @notice get the time fratcion since last update.
    /// @return the time fraction since last update.
    function _getTimeFractionSinceLastUpdate() internal view returns (uint) {
        if (DemoMode) {
            return (block.timestamp - lastBlockUpdateTime); // for testing purpose only
        }
        return (block.timestamp - lastBlockUpdateTime) / 1 days;
    }

    /// @notice Update rewards.
    function _updateRewards() internal {
        // update rewards only if it has not been updated for 1 day.
        if (DemoMode || block.timestamp > lastBlockUpdateTime + 1 days) {
            _updateETHprice();
            // compute the time fraction since last update
            uint timeFraction = _getTimeFractionSinceLastUpdate();
            // determine the divisor (60 for testing purpose, 365 for production)
            uint divisor = DemoMode ? 60 : 365;
            // update rewards for each user
            for (uint i = 0; i < userList.length; i++) {
                uint _newRewards = (_getUserTotalStaked(userList[i]) *
                    (APR + getBonusCoefficient(userList[i])) *
                    timeFraction) /
                    divisor /
                    10000;
                users[userList[i]].pendingRewards += _newRewards;
            }
            lastBlockUpdateTime = block.timestamp;
            emit RewardsUpdated();
        }
    }
}
