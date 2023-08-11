// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 0x4a85De63c78332EDF51033196b6108519d4EDC59 mumbai owner 0x2780998f93eafa3797b31a01e3debc0da3f5f495
// 0x2b651AC68B8D637065DD6E3c8a0272eadF3A7e3C is with mint function deployed by same address 
contract Token is ERC20, Ownable {
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public isBlacklisted;
    mapping(address => address[]) public peerInteractions;
    mapping(address => mapping(address => bool)) public isPeerInteractionRecorded;


    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address[] memory initialWhitelist
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
        
        // Initialize the whitelist
        for (uint256 i = 0; i < initialWhitelist.length; i++) {
            address wallet = initialWhitelist[i];
            isWhitelisted[wallet] = true;
            _mint(wallet, initialSupply * (10 ** uint256(decimals())));

        }
    }

	
    function mint(address to) external onlyOwner {
	_mint(to, 15 * (10 ** uint256(decimals())));	
    } 

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "not whitelisted");
        _;
    }

    function transfer(address recipient, uint256 amount) public override onlyWhitelisted returns (bool) {
        require(!isBlacklisted[recipient], "Recipient is blacklisted");
        // record peer interaction 

        // check if the interaction is already recorded 
        if(!isPeerInteractionRecorded[msg.sender][recipient] ) {
            recordInteraction(msg.sender, recipient);
        }
        return super.transfer(recipient, amount);
    }


// to blacklist a wallet, you need to be the owner of the contract, and also the wallet needs to be whitelisted ? 
    function blacklist(address wallet) external onlyOwner {
        require(isWhitelisted[wallet], "Wallet is not whitelisted");
        isBlacklisted[wallet] = true;
        isWhitelisted[wallet] = false;

        emit WalletBlacklisted(wallet);

        // Blacklist all peers that have directly interacted with the blacklisted wallet
        address[] memory peers = peerInteractions[wallet];
        for (uint256 i = 0; i < peers.length; i++) {
            address peer = peers[i];
            isBlacklisted[peer] = true;
            emit WalletBlacklisted(peer);
        }
    }

    function whitelist(address wallet) external onlyOwner {
        isBlacklisted[wallet] = false;
        isWhitelisted[wallet] = true;
        emit WalletWhitelisted(wallet);

        // Whitelist peers that were blacklisted because of the re-whitelisted wallet
        address[] memory peers = peerInteractions[wallet];
        for (uint256 i = 0; i < peers.length; i++) {
            address peer = peers[i];
            isBlacklisted[peer] = false;
            isWhitelisted[wallet] = true;

            emit WalletWhitelisted(peer);
        }
    }

    function recordInteraction(address from, address to) internal {
        peerInteractions[from].push(to);
        peerInteractions[to].push(from);
        isPeerInteractionRecorded[from][to] = true;
        isPeerInteractionRecorded[to][from] = true;
    }

    function directPeers(address wallet) public view returns (address[] memory) {
        return peerInteractions[wallet];
    }

    function addInitialWhitelist(address[] memory wallets) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            address wallet = wallets[i];
            isWhitelisted[wallet] = true;
            emit WalletWhitelisted(wallet);
        }
    }

    event WalletBlacklisted(address indexed wallet);
    event WalletWhitelisted(address indexed wallet);
}


/*

quesitonss - 
what is direct interact? if wallet A sends ether to wallet b, it means A has directly interacted with B, but does B has also directly interacted with A?
 */
