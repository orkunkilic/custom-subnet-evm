//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./INonce.sol";

contract ExampleNonce {
    address constant NONCE_ADDRESS = 0x0300000000000000000000000000000000000001;
    INonce nonce = INonce(NONCE_ADDRESS);

    function getNonce(address account) public view returns (uint256) {
        return nonce.getNonce(account);
    }
}
