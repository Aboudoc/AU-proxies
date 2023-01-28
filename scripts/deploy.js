const hre = require("hardhat")

async function main() {
    const Proxy = await hre.ethers.getContractFactory("Proxy")
    const proxy = await Proxy.deploy()

    await proxy.deployed()

    console.log(`Deployed to: ${proxy.address} `)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
