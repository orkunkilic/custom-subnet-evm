//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IGasRevenue.sol";

// ExampleHelloWorld shows how the HelloWorld precompile can be used in a smart contract.
contract ExampleGasRevenue {
  address constant GAS_REVENUE_ADDRESS = 0x0300000000000000000000000000000000000000;
  IGasRevenue gasRevenue = IGasRevenue(GAS_REVENUE_ADDRESS);

  uint256 public sum;

  function register() public {
    try gasRevenue.register() {} catch {
      revert("register failed");
    }
  }

  function isRegistered() public view returns (bool registered) {
    return gasRevenue.isRegistered(address(this));
  }

  function withdraw(address recipient) public {
    gasRevenue.withdraw(recipient);
  }

  function getBalance() public view returns (uint256 balance) {
    return gasRevenue.balanceOf(address(this));
  }

  function getPercentages() public view returns (uint256 blackhole, uint256 coinbase, uint256 gasRevenueContract) {
    blackhole = gasRevenue.getPercentage(IGasRevenue.Target.Blackhole);
    coinbase = gasRevenue.getPercentage(IGasRevenue.Target.Coinbase);
    gasRevenueContract = gasRevenue.getPercentage(IGasRevenue.Target.GasRevenueContract);
  }

  function test(uint256 n) public {
    // loop 10 times and return the sum
    uint256 _sum = 0;
    for (uint256 i = 0; i < n; i++) {
      _sum += i;
    }
    sum = _sum;
  }
}