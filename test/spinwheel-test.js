const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SpinWheel", function () {
  let owner;
  let addr1;
  let spinWheelContract;

  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    console.log("owner account is ", owner.address);
    const SpinWheel = await ethers.getContractFactory("SpinWheel");
    spinWheelContract = await SpinWheel.deploy();
    await spinWheelContract.deployed();
  });
  
});
