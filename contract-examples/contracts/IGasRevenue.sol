// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "./IAllowList.sol";

interface IGasRevenue is IAllowList {
    enum Target {
        Blackhole,
        Coinbase,
        GasRevenueContract
    }

    function getPercentage(Target target) external view returns (uint256 percentage);
    function isRegistered(address contractAddress) external view returns (bool registered);
    function balanceOf(address contractAddress) external view returns (uint256 balance);

    function setPercentage(Target[] memory target, uint256[] memory percentage) external returns (bool success); // sum = 1000
    function register() external;
    function withdraw(address recipient) external returns (uint256 amount);
}