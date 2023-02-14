// (c) 2019-2022, Ava Labs, Inc. All rights reserved.
// See the file LICENSE for licensing terms.

import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, ContractFactory } from "ethers"

describe("ExampleGasRevenue", function () {
  const PERCENTAGE_DENOMINATOR = 1000

  let gasRevenueContract: Contract

  before(async function () {
    // Deploy Hello World Contract
    const ContractF: ContractFactory = await ethers.getContractFactory(
      "ExampleGasRevenue"
    )
    gasRevenueContract = await ContractF.deploy()
    await gasRevenueContract.deployed()
    const gasRevenueContractAddress: string = gasRevenueContract.address
    console.log(`Contract deployed to: ${gasRevenueContractAddress}`)
  })

  it("should get balance", async () => {
    expect((await gasRevenueContract.functions.getBalance()).balance).to.be.equal(
      ethers.BigNumber.from(0)
    )
  })

  it("should get isRegistered", async () => {
    expect((await gasRevenueContract.functions.isRegistered()).registered).to.be.false
  })

  it("should get percentages", async () => {
    const percentages = await gasRevenueContract.functions.getPercentages()
    expect(percentages[0]).to.be.equal(500)
    expect(percentages[1]).to.be.equal(250)
    expect(percentages[2]).to.be.equal(250)
  })

  it("should register", async () => {
    const isRegistered = await gasRevenueContract.callStatic.isRegistered()
    expect(isRegistered).to.be.false

    const registerTx = await gasRevenueContract.functions.register()
    await registerTx.wait()

    const isRegisteredAfter = await gasRevenueContract.callStatic.isRegistered()
    expect(isRegisteredAfter).to.be.true

    // it should not be possible to register twice
    await expect(gasRevenueContract.functions.register()).to.be.revertedWith("execution reverted") // FIXME: revert reason is not correct
  })

  it("should not register EOA", async () => {
    const GasRevenuePrecompileContract = await ethers.getContractAt(
      "IGasRevenue",
      "0x0300000000000000000000000000000000000000"
    )

    // await expect(GasRevenuePrecompileContract.register()).to.be.revertedWith("execution reverted") // FIXME: revert reason is not correct
  })

  it("should calculate gas revenue", async () => {
    // already registered as precompiles holds the state
    console.log("isRegistered ", (await gasRevenueContract.callStatic.isRegistered()))

    const testTx = await gasRevenueContract.functions.test(10, {
      type: 0,
      gasPrice: 1_000_000_000,
    })
    const testReceipt = await testTx.wait()

    const gasUsed = testReceipt.cumulativeGasUsed
    const totalGasPaid = gasUsed.mul(ethers.BigNumber.from(1_000_000_000))
    const percentages = await gasRevenueContract.callStatic.getPercentages()
    const gasRevenue = totalGasPaid.mul(percentages[2]).div(PERCENTAGE_DENOMINATOR)
    console.log(`Expected gas revenue: ${gasRevenue}`)

    const balance = await gasRevenueContract.functions.getBalance()
    console.log(`Actual gas revenue: ${balance.balance}`)

    const precompileBalance = await ethers.provider.getBalance("0x0300000000000000000000000000000000000000")
    console.log(`Precompile balance: ${precompileBalance}`)

    expect(precompileBalance).to.be.equal(balance.balance)

    // FIXME: error on gasRevenue calc.
    expect(balance.balance).to.be.equal(gasRevenue)

  });


})