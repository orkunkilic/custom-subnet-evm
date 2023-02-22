import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract, ContractFactory } from "ethers"

describe("ExampleNonce", function () {
  let nonceContract: Contract

  before(async function () {
    const ContractF: ContractFactory = await ethers.getContractFactory(
      "ExampleNonce"
    )
    nonceContract = await ContractF.deploy()
    await nonceContract.deployed()
    const nonceContractAddress: string = nonceContract.address
    console.log(`Contract deployed to: ${nonceContractAddress}`)
  })

  it("should getNonce properly", async function () {
    const [user, other] = await ethers.getSigners()
    const beforeNonce = await nonceContract.callStatic.getNonce(other.address)
    expect(beforeNonce).to.equal(0)

    const tx1 = await user.sendTransaction({
        to: other.address,
        value: ethers.utils.parseEther("2.0"),
    })
    await tx1.wait()

    // send eth to other 
    const tx2 = await other.sendTransaction({
        to: user.address,
        value: ethers.utils.parseEther("1.0"),
    })
    await tx2.wait()

    const afterNonce = await nonceContract.callStatic.getNonce(other.address)
    expect(afterNonce).to.equal(beforeNonce.add(1))
  })
})