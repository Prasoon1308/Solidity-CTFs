# QuillCTF 5: Donate

## Objective
- Call`keepercheck` function and get true 

## Target contract
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

contract Donate {
    event t1(bytes _sig);
    address payable public keeper;
    address public owner;
    event newDonate(address indexed, uint amount);

    modifier onlyOwner() {
        require(
            msg.sender == owner || msg.sender == address(this),
            "You are not Owner"
        );
        _;
    }

    constructor(address _keeper) {
        keeper = payable(_keeper);
        owner = msg.sender;
    }

    function pay() external payable {
        keeper.transfer(msg.value);
        emit newDonate(msg.sender, msg.value);
    }

    function changeKeeper(address _newKeeper) external onlyOwner {
        keeper = payable(_newKeeper);
    }

    function secretFunction(string memory f) external {
        require(
            keccak256(bytes(f)) !=
                0x097798381ee91bee7e3420f37298fe723a9eedeade5440d4b2b5ca3192da2428,
            "invalid"
        );
        (bool success, ) = address(this).call(
            abi.encodeWithSignature(f, msg.sender)
        );
        require(success, "call fail");
    }

    function keeperCheck() external view returns (bool) {
        return (msg.sender == keeper);
    }
}
```

## The Attack
The `changeKeeper` function can apparently be called only by the `owner` or the contract address itself. 

The `secretFunction` has an attribute where it calls one of the internal functions if the correct string of `f` is passed in the argument such that it calls `changeKeeper` function. The `secretFunction` has a security check that the hash of `changeKeeper(address)` cannot be sent as an input as it's hash exactly matches the undesired hash. 
But when we deal with function selectors, including in transactions and when encoding function calls, only the first four bytes of the keccak256 hash of the function signature are considered. So we need a function name with same argument which has first four hash similar to the `changeKeeper(address)`, i.e similar to `<xyz>(address)`. Using [4byte](http://www.4byte.directory/) we can find out our target function signature by giving the first four indexes of the hash.
We get two results for this:
- `changeKeeper(address)`
- `refundETHAll(address)`

So, we use `refundETHAll(address)` as the value of the argument for the `secretFunction` function.