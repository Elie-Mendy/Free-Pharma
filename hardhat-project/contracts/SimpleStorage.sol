// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract SimpleStorage {
  // State variable to store a number
  uint public storedData;

  // Event to notify when a number is stored
  event ValueStored(address author, uint value);

  // Function to set the current stored value
  function set(uint x) public {
    storedData = x;
    
    // Emit an event to notify the stored value
    emit ValueStored(msg.sender, x);
  }
}