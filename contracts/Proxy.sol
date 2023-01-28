// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./StorageSlot.sol";

/** @title A simple Proxy pattern
 * @author Reda Aboutika
 * @notice This contract is for upgrades.
 * @dev Issue if we are tracking lots of users balances (big protocol)
 * A massive data migration will be needed.
 */
contract Proxy {
    address implementation;

    /**
     * @dev This is the function that allows to add more features by upgrading
     *  We can pass any calldata and forward that along to the logic contract
     * tripleX from Logic2 can be called thanks to this fallback
     */
    fallback() external {
        (bool success, ) = implementation.call(msg.data);
        require(success);
    }

    /**
     * @dev This is the function that allows to change the logic
     */
    function changeImplementation(address _implementation) external {
        implementation = _implementation;
    }
}

/** @title the logic1
 * @notice This contract added changeX feature
 */
contract Logic1 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }
}

/** @title the logic2
 * @notice This contract added tripleX feature
 * @dev tripleX can be executed thanks to the call from proxy's fallback function
 */
contract Logic2 {
    uint256 public x;

    function changeX(uint256 _x) external {
        x = _x;
    }

    function tripleX() external {
        x *= 3;
    }
}
