# Solidity CTFs

This project contains the CTFs over different challenges for the solidity smart contracts.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Solving a CTF
The [contracts](/Users/prasoonpatel/Desktop/Prasoon/Blockchain/CTFs/contracts) contains the challenge solidity files of which the vulnerabilites will be addressed in the [docs](/Users/prasoonpatel/Desktop/Prasoon/Blockchain/CTFs/docs). The [test](/Users/prasoonpatel/Desktop/Prasoon/Blockchain/CTFs/test) contains the attack on the targeted vulnerabilites.

Each test will be having same following format:

```javascript
const {expect} = require("chai");
const {ethers} = require("hardhat");
const { loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("<ctf-name> <number>: <challenge-name>", ()=>{
  // contract
  let contract;
  // accounts
  let owner;
  let attacker;

  // pre-hack setup
  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("<Contract-name>", owner);
    contract = await Contract.deploy();
    await contract.waitForDeployment();
    // console.log(owner, attacker, contract);

    return { owner, attacker, contract };
  }

  // pawnage
  it("should hack the contract", async()=>{
    const {owner, attacker, contract} = await loadFixture(runEveryTime);
  });

  // post-hack check
  after(async()={
    expect(attacker.address).to.be.properAddress;
    expect(<condition>).to.be.true;
  });
})
```