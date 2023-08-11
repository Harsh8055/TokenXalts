// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MerkleProof {
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash < proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }
}

contract MerkleWhitelist {
    bytes32 public root;
    mapping(address => bool) public whitelisted;

    constructor(bytes32 _root) {
        root = _root;
    }

    function whitelist(address[] memory addresses, bytes32[] memory proof) external {
        require(MerkleProof.verify(proof, root, bytes32(bytes20(msg.sender))), "Invalid proof");
        
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelisted[addresses[i]] = true;
        }
    }

    function isWhitelisted(address addr) external view returns (bool) {
        return whitelisted[addr];
    }
}
