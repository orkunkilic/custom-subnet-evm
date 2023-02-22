// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface INonce {
    function getNonce(address account) external view returns (uint256 nonce);
}
