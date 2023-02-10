// (c) 2019-2022, Ava Labs, Inc. All rights reserved.
// See the file LICENSE for licensing terms.

import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, ContractFactory } from "ethers"

describe("ExampleGasRevenue", function () {
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

  it("should getBalance properly", async function () {
    const [signer1, signer2] = await ethers.getSigners()
    let result = await gasRevenueContract.callStatic.getBalance(signer2.address)
    expect(result).to.equal(0)

    // send eth to someone
    const [signer] = await ethers.getSigners()
    const tx = await signer.sendTransaction({
        to: signer2.address,
        value: ethers.utils.parseEther("1.0"),
        gasPrice: 7000000000,
    })
    await tx.wait()

    result = await gasRevenueContract.callStatic.getBalance(signer2.address)
    console.log("result: ", result.toString())

    let refund = 21000 * 7000000000 / 2
    expect(result).to.equal(refund)

  })

  it("should setGreeting and getHello", async function () {
    const [signer1, signer2] = await ethers.getSigners()

    // send eth to address
    const [signer] = await ethers.getSigners()
    const tx = await signer.sendTransaction({
        to: signer2.address,
        value: ethers.utils.parseEther("1.0"),
        gasPrice: 7000000000,
    })
    await tx.wait()

    // check balance
    const result = await gasRevenueContract.callStatic.getBalance(signer2.address)
    console.log("result: ", result.toString())

    // befoer balance
    const beforeBalance = await ethers.provider.getBalance(signer2.address)
    console.log("beforeBalance: ", beforeBalance.toString())

    // gas revenue before balance
    const gasRevenueBalanceBefore = await ethers.provider.getBalance("0x0300000000000000000000000000000000000000")
    console.log("gasRevenueBalanceBefore: ", gasRevenueBalanceBefore.toString())

    // withdraw
    const tx2 = await gasRevenueContract.connect(signer2).withdraw(signer2.address, {
      gasPrice: 7000000000,
    })
    const tx2Receipt = await tx2.wait()

    // check balance
    const result2 = await gasRevenueContract.callStatic.getBalance(signer2.address)
    console.log("result2: ", result2.toString())

    expect(result2).to.equal(0)

    // check wallet balance
    const balance = await ethers.provider.getBalance(signer2.address)
    console.log("balance: ", balance.toString())

    // check gas revenue balance
    const gasRevenueBalance = await ethers.provider.getBalance("0x0300000000000000000000000000000000000000")
    console.log("gasRevenueBalance: ", gasRevenueBalance.toString())
    
    // check gas refund
    let refund = result
    expect(balance).to.equal(beforeBalance.add(refund).sub(tx2Receipt.gasUsed.mul(7000000000)))

  })
})