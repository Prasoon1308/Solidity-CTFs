const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QuillCTF 4: D31eg4t3", function () {
  let contract;
  let owner;
  let attacker;

  let contractAddress;
  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();
    // console.log(owner, attacker);

    const Contract = await ethers.getContractFactory("D31eg4t3", owner);
    contract = await Contract.deploy();
    await contract.waitForDeployment();

    contractAddress = await contract.getAddress();
    // console.log(owner, attacker, contract);
    // console.log(owner.address, attacker.address, contractAddress);
    return { owner, attacker, contract, contractAddress };
  }

  it("should claim ownership and hack the contract", async () => {
    const { owner, attacker, contract } = await loadFixture(runEveryTime);

    const AttackContract = await ethers.getContractFactory("D31eg4t3Attack", attacker);
    const attackContract = await AttackContract.deploy();
    await attackContract.waitForDeployment();
    // const attackContractAddress = await attackContract.getAddress();
    // console.log(attackContractAddress);

    await attackContract.connect(attacker).attack(contractAddress);
    // console.log("Attacker address:", attacker.address);
    // console.log("Contract address:", await contract.owner());
    // console.log("Hacked:", await contract.canYouHackMe(attacker.address));
  });

  after(async () => {
    expect(await contract.owner()).to.be.equal(attacker.address);
    expect(await contract.canYouHackMe(attacker.address)).to.be.equal(true);
  });
});