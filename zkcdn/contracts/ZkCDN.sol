// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol"; 

contract ZkCDN is ERC721, ERC721URIStorage, Ownable {
    event Mint(address to, uint256 encrypted_cid);
    event Encrypted_CID(uint256 encrypted_cid);
    event ConvertedString(uint256 encrypted_cid);

    constructor() ERC721("ZkCDN", "ZCDN") {}
    mapping(uint256 => string) internal uniqueInt_to_string;
    uint256[] public encrypted_ipfs;
    string[] public ipfs_hash;
    mapping(address => uint256[]) public IPFS_of_Account;
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;


    function getStringFromInt(uint256 _val) public returns(string memory){
        emit ConvertedString(_val);
        return uniqueInt_to_string[_val];
    }

    function safeMint(address to, string memory ipfs, uint256 encrypted_cid) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfs);
        emit Mint(to, encrypted_cid);

        encrypted_ipfs.push(encrypted_cid);
        ipfs_hash.push(ipfs);
        emit Encrypted_CID(encrypted_cid);

        IPFS_of_Account[to].push(encrypted_cid);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
 
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
    address from, 
    address to, 
    uint256 tokenId
    ) internal override virtual {
        require(from == address(0), "Err: token transfer is BLOCKED");   
        super._beforeTokenTransfer(from, to, tokenId);  
    }

}