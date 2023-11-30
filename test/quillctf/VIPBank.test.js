const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QuillCTF 3: VIP Bank", function () {
  let contract;
  let owner;
  let attacker;

  let contractAddress;
  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();
    // console.log(owner, attacker);

    const Contract = await ethers.getContractFactory("VIPBank", owner);
    contract = await Contract.deploy();
    await contract.waitForDeployment();

    await contract.connect(owner).addVIP(owner.address);
    contractAddress = await contract.getAddress();
    // console.log(owner, attacker, contract);
    // console.log(owner.address, attacker.address, contractAddress);
    return { owner, attacker, contract, contractAddress };
  }

  it("should lock the VIP user balance in the contract", async () => {
    const { owner, attacker, contract } = await loadFixture(runEveryTime);

    await contract
      .connect(owner)
      .deposit({ value: ethers.parseEther("0.025") });
    // console.log(await contract.contractBalance());

    const AttackContract = await ethers.getContractFactory(
      "VIPBankAttack",
      attacker
    );
    const attackContract = await AttackContract.deploy(contractAddress, {
      value: ethers.parseEther("0.51"),
    });
    await attackContract.waitForDeployment();
  });

  after(async () => {
    await expect(
      contract.withdraw(ethers.parseEther("0.025"))
    ).to.be.revertedWith("Cannot withdraw more than 0.5 ETH per transaction");
  });
});