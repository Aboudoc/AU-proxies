// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./StorageSlot.sol";

/** @title A simple Proxy pattern
 * @author Reda Aboutika
 * @notice This contract is for upgrades.
 * @dev uses delegatecall to store values on proxy's storage
 * No massive data migration needed when upgrading
 */
contract Proxy {
    /**
     * @dev Make sure you're not collating with the storage values
     * keep x at slot 0x0 in proxy and other logic contracts
     * eip1967: modify an arbitrary storage slot that we create to put away the implementation
     */
    uint256 x;
    address implementation;

    fallback() external {
        (bool success, ) = implementation.delegatecall(msg.data);
        require(success);
    }

    function changeImplementation(address _implementation) external {
        implementation = _implementation;
    }
}

contract Logic1 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }
}

contract Logic2 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }

    function tripleX() external {
        x *= 3;
    }
}
