# QuillCTF 2: ConfidentialHash

## Objective
- Find the keccak256 hash of aliceHash and bobHash.

## Target contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ConfidentialHash {
    string public firstUser = "ALICE";
    uint public alice_age = 24;
		bytes32 private ALICE_PRIVATE_KEY; //Super Secret Key
    bytes32 public ALICE_DATA = "QWxpY2UK";
    bytes32 private aliceHash = hash(ALICE_PRIVATE_KEY, ALICE_DATA);

    string public secondUser = "BOB";
    uint public bob_age = 21;
    bytes32 private BOB_PRIVATE_KEY; // Super Secret Key
    bytes32 public BOB_DATA = "Qm9iCg";
    bytes32 private bobHash = hash(BOB_PRIVATE_KEY, BOB_DATA);
		
		constructor() {}

    function hash(bytes32 key1, bytes32 key2) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(key1, key2));
    }

    function checkthehash(bytes32 _hash) public view returns(bool){
        require (_hash == hash(aliceHash, bobHash));
        return true;
    }
}
```

## The Attack
Using `private` visibility for the variables does not mean that they cannot be accessed by the normal user.

The state variables are stored in the EVM inside an array in a compact array. A slot can store up to 32bytes.
So when a variable in the slot is lower than 32 bytes, if the next variable can fit in the remaining space, it will be stored in the same slot.

For our target contract, each variable can be stored within the range of 32-bytes. The storage slot to the variable mapping will be in the order of appearance, that is as follow:
- `0x0` has `firstUser` string, which is a string that can fit in less than 32 bytes.
- `0x1` has 256-bit Alice age.
- `0x2` has the 32-byte Alice private key.
- `0x3` has the 32-byte Alice data.
- `0x4` has the 32-byte Alice hash.
- `0x5` has `secondUser` string, which is a string that can fit in less than 32 bytes.
- `0x6` has 256-bit Bob age.
- `0x7` has the 32-byte Bob private key.
- `0x8` has the 32-byte Bob data.
- `0x9` has the 32-byte Bob hash.
