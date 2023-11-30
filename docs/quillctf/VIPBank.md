# QuillCTF 3: VIPBank

## Objective
- At any cost, lock the VIP user balance forever into the contract.

## Target Contract
```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract VIPBank{

    address public manager;
    mapping(address => uint) public balances;
    mapping(address => bool) public VIP;
    uint public maxETH = 0.5 ether;

    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager , "you are not manager");
        _;
    }

    modifier onlyVIP() {
        require(VIP[msg.sender] == true, "you are not our VIP customer");
        _;
    }

    function addVIP(address addr) public onlyManager {
        VIP[addr] = true;
    }

    function deposit() public payable onlyVIP {
        require(msg.value <= 0.05 ether, "Cannot deposit more than 0.05 ETH per transaction");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public onlyVIP {
        require(address(this).balance <= maxETH, "Cannot withdraw more than 0.5 ETH per transaction");
        require(balances[msg.sender] >= _amount, "Not enough ether");
        balances[msg.sender] -= _amount;
        (bool success,) = payable(msg.sender).call{value: _amount}("");
        require(success, "Withdraw Failed!");
    }

    function contractBalance() public view returns (uint){
        return address(this).balance;
    }

}
```

## The Attack
The major bug in this contract is that if the balance of the contract goes beyong the `maxEth`, no one will be able to call the `withdraw` function due to the requirement statement.

On the other hand, only the VIP are allowed to call the `deposit` function. However, we can transfer the funds using an attacker contract which will have `selfdestruct(address)` attribute. We can initially fund the attract contract, more than the `maxEth` value which will later be send to the VIPBank contract after the attacker contract is destroyed.

In short, we can by-pass the `deposit` constraint by using a self-destructing contract with enough funds to hack the contract such that after this no user will be able to withdraw, i.e, lock their tokens!