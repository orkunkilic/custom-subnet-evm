// (c) 2019-2022, Ava Labs, Inc. All rights reserved.
// See the file LICENSE for licensing terms.

import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, ContractFactory } from "ethers"

describe("ExampleGasRevenue", function () {
  let helloWorldContract: Contract

  before(async function () {
    // Deploy Hello World Contract
    const ContractF: ContractFactory = await ethers.getContractFactory(
      "ExampleGasRevenue"
    )
    helloWorldContract = await ContractF.deploy()
    await helloWorldContract.deployed()
    const helloWorldContractAddress: string = helloWorldContract.address
    console.log(`Contract deployed to: ${helloWorldContractAddress}`)
  })

  it("should getBalance properly", async function () {
    let result = await helloWorldContract.callStatic.getBalance("0x0400000000000000000000000000000000000000")
    expect(result).to.equal(0)

    // send eth to someone
    const [signer] = await ethers.getSigners()
    const tx = await signer.sendTransaction({
        to: "0x0400000000000000000000000000000000000000",
        value: ethers.utils.parseEther("1.0"),
        gasPrice: 7000000000,
    })
    await tx.wait()

    result = await helloWorldContract.callStatic.getBalance("0x0400000000000000000000000000000000000000")
    console.log("result: ", result.toString())

    let refund = 21000 * 7000000000 / 2
    // expect(result).to.greaterThan(0)

  })

//   it("should setGreeting and getHello", async function () {
//     const modifiedGreeting = "What's up"
//     let tx = await helloWorldContract.setGreeting(modifiedGreeting)
//     await tx.wait()

//     expect(await helloWorldContract.callStatic.getHello()).to.be.equal(
//       modifiedGreeting
//     )
//   })
})