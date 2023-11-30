const {expect} = require("chai");
const {ethers} = require("hardhat");
const { loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QuillCTF 2: ConfidentialHash", ()=>{
  let contract;
  let owner;
  let attacker;
  let contractAddress;  

  let hash;

  async function runEveryTime() {
    [owner, attacker] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("ConfidentialHash", owner);
    contract = await Contract.deploy();
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
    // console.log(owner, attacker, contract);
    // console.log(owner.address, attacker.address, contractAddress);

    return { owner, attacker, contract };
  }

  it("should find the private variables", async()=>{
    const {owner, attacker, contract} = await loadFixture(runEveryTime);

    const aliceHash = await ethers.provider.getStorage(contractAddress, ethers.toQuantity(4));
    const bobHash = await ethers.provider.getStorage(contractAddress, ethers.toQuantity(9));
    // console.log(aliceHash, bobHash);

    hash = ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [aliceHash, bobHash]);
    // console.log(await contract.checkthehash(hash));

  });

  after(async()=>{
    // console.log(await contract.checkthehash(hash));
    expect(await contract.checkthehash(hash)).to.be.true;
  });
})