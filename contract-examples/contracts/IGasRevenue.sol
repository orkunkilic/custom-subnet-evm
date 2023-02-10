// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

interface IGasRevenue {
    function isRegistered(address contractAddress) external view returns (bool registered);
    function balanceOf(address contractAddress) external view returns (uint256 balance);

    function register() external;
    function withdraw(address recipient) external;
}