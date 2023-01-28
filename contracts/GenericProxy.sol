// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./StorageSlot.sol";

/**
 * @dev This proxy contract is implementing eip1967
 * Manual spot to store the implementation
 * implementation's variables cannot collite with proxy
 */
contract GenericProxy {
    fallback() external {
        (bool success, ) = StorageSlot.getAddressSlot(keccak256("impl")).value.delegatecall(msg.data);
        require(success);
    }

    function changeImplementation(address _implementation) external {
        StorageSlot.getAddressSlot(keccak256("impl")).value = _implementation;
    }
}

contract Impl1 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }
}

contract Impl2 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }

    function tripleX() external {
        x *= 3;
    }
}
