// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IGasRevenue {
    enum Target {
        Blackhole,
        Coinbase,
        GasRevenueContract
    }

    function getPercentage(Target target) external view returns (uint256 percentage);
    function isRegistered(address contractAddress) external view returns (bool registered);
    function balanceOf(address contractAddress) external view returns (uint256 balance);

    function register() external returns (bool success);
    function withdraw(address recipient) external returns (uint256 amount);
}