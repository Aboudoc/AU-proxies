# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Proxy contract

This contract shows a simple proxy upgradable to Logic1 and Logic2

//Test//

For test purposes, get contract (ABI) Logic1 and Logic2 with proxy address

```shell
const proxyAsLogic1 = await ethers.getContractAt("Logic1", proxy.address)
const proxyAsLogic = await ethers.getContractAt("Logic2", proxy.address)
```

Using 2 ways to check x value:

```shell
assert.equal(await logic1.x(), 0)
assert.equal(await ethers.provider.getStorageAt(logic1.address, 0x0), 0)
```

By using eth_storageAt we are bypinssing the public getter, we can remove public viewer on x variable

# Proxy V2 contract

The storage values are inside of the proxy. This is where the delegatecall comes in. No data migration needed in case of ugrading to logic2

# Generic Proxy contract

Using eip1967: modify an arbitrary storage slot that we create to put away the implementation to make sure it doesn't collate with any storage variables => library StorageSlot

```shell
    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
```

This Proxy should only be used for learning purposes! One thing that it does not do is return the return value in the fallback function. This can only be done by dropping down into assembly code, as shown by the OpenZeppelin proxy logic here. In general, you should try to stick to using proxies that are audited and battle tested!
