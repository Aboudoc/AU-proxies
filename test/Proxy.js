const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("Proxy", function () {
    async function deployFixture() {
        const [owner] = await ethers.getSigners()

        const Proxy = await ethers.getContractFactory("Proxy")
        const proxy = await Proxy.deploy()

        const Logic1 = await ethers.getContractFactory("Logic1")
        const logic1 = await Logic1.deploy()

        const Logic2 = await ethers.getContractFactory("Logic2")
        const logic2 = await Logic2.deploy()

        const proxyAsLogic1 = await ethers.getContractAt("Logic1", proxy.address)
        const proxyAsLogic2 = await ethers.getContractAt("Logic2", proxy.address)

        return { proxy, logic1, logic2, owner, proxyAsLogic1, proxyAsLogic2 }
    }

    // eth_getStorageAt
    async function lookupUint(contractAddr, slot) {
        return parseInt(await ethers.provider.getStorageAt(contractAddr, slot))
    }

    it("Should work with logic 1", async function () {
        const { proxy, logic1, proxyAsLogic1 } = await loadFixture(deployFixture)

        await proxy.changeImplementation(logic1.address)

        // assert.equal(await logic1.x(), 0)
        assert.equal(await lookupUint(logic1.address, 0x0), 0)

        await proxyAsLogic1.changeX(22)

        // assert.equal(await logic1.x(), 22)
        assert.equal(await lookupUint(logic1.address, 0x0), 22)
    })

    it("Should work with upgrades", async function () {
        const { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2 } = await loadFixture(deployFixture)

        await proxy.changeImplementation(logic1.address)

        // assert.equal(await logic1.x(), 0)
        assert.equal(await ethers.provider.getStorageAt(logic1.address, 0x0), 0)

        await proxyAsLogic1.changeX(69)

        // assert.equal(await logic1.x(), 69)
        assert.equal(await ethers.provider.getStorageAt(logic1.address, 0x0), 69)

        await proxy.changeImplementation(logic2.address)

        // assert.equal(await logic2.x(), 0)
        assert.equal(await ethers.provider.getStorageAt(logic2.address, 0x0), 0)

        await proxyAsLogic2.changeX(55)

        // assert.equal(await logic2.x(), 55)
        assert.equal(await ethers.provider.getStorageAt(logic2.address, 0x0), 55)
    })
})

// describe("GenericProxy", function () {
//     async function deployGenericFixture() {
//         const [owner] = await ethers.getSigners()

//         const GenericProxy = await ethers.getContractFactory("GenericProxy")
//         const genericProxy = await GenericProxy.deploy()

//         const Impl1 = await ethers.getContractFactory("Impl1")
//         const impl1 = await Impl1.deploy()

//         const Impl2 = await ethers.getContractFactory("Impl2")
//         const impl2 = await Impl2.deploy()

//         const proxyAsLogic1 = await ethers.getContractAt("Impl1", genericProxy.address)
//         const proxyAsLogic2 = await ethers.getContractAt("Impl2", genericProxy.address)

//         return { owner, proxyAsLogic1, proxyAsLogic2, genericProxy, impl1, impl2 }
//     }

// it("Should work with upgrades", async function () {
//     const { genericProxy, proxyAsLogic1, proxyAsLogic2, impl1, impl2 } = await loadFixture(deployGenericFixture)

//     await genericProxy.changeImplementation(impl1.address)

//     assert.equal(await impl1.x(), 0)

//     await proxyAsLogic1.changeX(22)

// assert.equal(await impl1.x(), 22)
// })
// })
