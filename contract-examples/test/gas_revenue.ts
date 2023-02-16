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
    expect((await gasRevenueContract.callStatic.getBalance())).to.be.equal(
      ethers.BigNumber.from(0)
    )
  })

  it("should get isRegistered", async () => {
    expect((await gasRevenueContract.callStatic.isRegistered())).to.be.false
  })

  it("should get percentages", async () => {
    const percentages = await gasRevenueContract.callStatic.getPercentages()

    // Initial config
    expect(percentages.blackhole).to.be.equal(ethers.BigNumber.from(500))
    expect(percentages.coinbase).to.be.equal(ethers.BigNumber.from(250))
    expect(percentages.gasRevenueContract).to.be.equal(ethers.BigNumber.from(250))
  })

  it("should register", async () => {
    const isRegistered = await gasRevenueContract.callStatic.isRegistered()
    expect(isRegistered).to.be.false

    // this also adds balance to the newly created contract
    const registerTx = await gasRevenueContract.functions.register()
    await registerTx.wait()

    const isRegisteredAfter = await gasRevenueContract.callStatic.isRegistered()
    expect(isRegisteredAfter).to.be.true

    // it should not be possible to register twice
    await expect(gasRevenueContract.functions.register()).to.be.revertedWith("register failed") // FIXME: revert reason is not correct
  })

  it("should not register EOA", async () => {
    const GasRevenuePrecompileContract = await ethers.getContractAt(
      "IGasRevenue",
      "0x0300000000000000000000000000000000000000"
    )

    // catch thrown exception
    try {
      await GasRevenuePrecompileContract.functions.register()
    } catch (e) {
      expect(e.message).to.be.equal("caller is not a smart contract")
    }
  })

  it("should calculate gas revenue", async () => {
    // prebalance
    const preBalance = await gasRevenueContract.callStatic.getBalance()

    const testTx = await gasRevenueContract.functions.test(10, {
      type: 0,
      gasPrice: 1_000_000_000,
    })
    const testReceipt = await testTx.wait()

    const gasUsed = testReceipt.cumulativeGasUsed
    const totalGasPaid = gasUsed.mul(ethers.BigNumber.from(1_000_000_000))
    const percentages = await gasRevenueContract.callStatic.getPercentages()
    const gasRevenue = totalGasPaid.mul(percentages[2]).div(PERCENTAGE_DENOMINATOR)

    const balance = await gasRevenueContract.callStatic.getBalance()

    const precompileBalance = await ethers.provider.getBalance("0x0300000000000000000000000000000000000000")

    expect(precompileBalance).to.be.equal(balance)

    // FIXME: error on gasRevenue calc.
    expect(balance.sub(preBalance)).to.be.equal(gasRevenue)
  });

  it("should withdraw", async () => {
    const [signer1, signer2] = await ethers.getSigners()

    const preBalance = await gasRevenueContract.callStatic.getBalance()
    expect(preBalance).to.be.gt(0)

    const withdrawTx = await gasRevenueContract.functions.withdraw(signer2.address, {
      type: 0,
      gasPrice: 1_000_000_000,
    })
    const withdrawReceipt = await withdrawTx.wait()

    const percentages = await gasRevenueContract.callStatic.getPercentages()

    const recipientBalance = await ethers.provider.getBalance(signer2.address)
    expect(recipientBalance).to.be.equal(preBalance)

    // new balance should be the gas revenue of withdraw()
    const newBalance = await gasRevenueContract.callStatic.getBalance()
    expect(newBalance).to.be.equal(
      withdrawReceipt.cumulativeGasUsed.mul(ethers.BigNumber.from(1_000_000_000))
        .mul(percentages[2])
        .div(PERCENTAGE_DENOMINATOR)
    )
  })
});