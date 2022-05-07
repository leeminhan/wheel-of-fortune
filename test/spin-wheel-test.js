const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SpinWheel", function () {
    
    let randomNumberConsumerV2, vrfCoordinatorV2Mock

    beforeEach(async () => {
        await deployments.fixture(["mocks", "vrf"])
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        randomNumberConsumerV2 = await ethers.getContract("RandomNumberConsumerV2")
      })

    it("Should return zero during contract initialization", async function () {
        const SpinWheel = await ethers.getContractFactory("SpinWheel");
        const spinWheel = await SpinWheel.deploy();
        await spinWheel.deployed();
        expect(await spinWheel.getValue()).to.equal(0);
    });

  it("Should return 10 after the index is set to 1", async function () {
    const SpinWheel = await ethers.getContractFactory("SpinWheel");
    const spinWheel = await SpinWheel.deploy();
    await spinWheel.deployed();
    await spinWheel.setValues(1);
    expect(await spinWheel.getValue()).to.equal(10);
  });

  it("Should return 200 after the index is set to 4", async function () {
    const SpinWheel = await ethers.getContractFactory("SpinWheel");
    const spinWheel = await SpinWheel.deploy();
    await spinWheel.deployed();
    await spinWheel.setValues(4);
    expect(await spinWheel.getValue()).to.equal(200);
  });

  it("Should successfully request a random number and get a result", async () => {
    await randomNumberConsumerV2.requestRandomWords()
    const requestId = await randomNumberConsumerV2.s_requestId()

    // simulate callback from the oracle network
    await expect(
      vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
    ).to.emit(randomNumberConsumerV2, "ReturnedRandomness")

    const firstRandomNumber = await randomNumberConsumerV2.s_randomWords(0) // (firstRandomNumber.mod(6).toNumber()) == 5
    const secondRandomNumber = await randomNumberConsumerV2.s_randomWords(1) // (firstRandomNumber.mod(6).toNumber()) == 3
  });

  it("Should successfully request a random number and return 1000 after the index is set to 5", async () => {
    await randomNumberConsumerV2.requestRandomWords()
    const requestId = await randomNumberConsumerV2.s_requestId()

    // simulate callback from the oracle network
    await expect(
      vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
    ).to.emit(randomNumberConsumerV2, "ReturnedRandomness")

    const firstRandomNumber = await randomNumberConsumerV2.s_randomWords(0)
    const SpinWheel = await ethers.getContractFactory("SpinWheel");
    const spinWheel = await SpinWheel.deploy();
    await spinWheel.deployed();
    await spinWheel.setValues(firstRandomNumber.mod(6).toNumber());
    expect(await spinWheel.getValue()).to.equal(1000);
  });

  it("Should successfully request a random number and return 100 after the index is set to 3", async () => {
    await randomNumberConsumerV2.requestRandomWords()
    const requestId = await randomNumberConsumerV2.s_requestId()

    // simulate callback from the oracle network
    await expect(
      vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
    ).to.emit(randomNumberConsumerV2, "ReturnedRandomness")

    const secondRandomNumber = await randomNumberConsumerV2.s_randomWords(1)
    const SpinWheel = await ethers.getContractFactory("SpinWheel");
    const spinWheel = await SpinWheel.deploy();
    await spinWheel.deployed();
    await spinWheel.setValues(secondRandomNumber.mod(6).toNumber());
    expect(await spinWheel.getValue()).to.equal(100);
  });

});
