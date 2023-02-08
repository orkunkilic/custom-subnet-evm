//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IGasRevenue.sol";

// ExampleHelloWorld shows how the HelloWorld precompile can be used in a smart contract.
contract ExampleGasRevenue {
  address constant GAS_REVENUE_ADDRESS = 0x0300000000000000000000000000000000000000;
  IGasRevenue gasRevenue = IGasRevenue(GAS_REVENUE_ADDRESS);

  function getBalance(address contractAddress) public view returns (uint256 balance) {
    return gasRevenue.balanceOf(contractAddress);
  }

  function withdraw(address contractAddress) public {
    gasRevenue.withdraw(contractAddress);
  }
}