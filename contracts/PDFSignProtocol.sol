// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract PDFSigningProtocol {
    struct Signature {
        address signer;
        bytes32 documentHash;
        uint256 timestamp;
    }

    mapping(bytes32 => Signature) public signatures;

    event DocumentSigned(address indexed signer, bytes32 indexed documentHash, uint256 timestamp);

    function signDocument(bytes32 _documentHash) public {
        require(signatures[_documentHash].signer == address(0), "Document already signed");

        signatures[_documentHash] = Signature({
            signer: msg.sender,
            documentHash: _documentHash,
            timestamp: block.timestamp
        });

        emit DocumentSigned(msg.sender, _documentHash, block.timestamp);
    }

    function getSignature(bytes32 _documentHash) public view returns (address, uint256) {
        Signature memory sig = signatures[_documentHash];
        require(sig.signer != address(0), "Document not signed");
        return (sig.signer, sig.timestamp);
    }
}