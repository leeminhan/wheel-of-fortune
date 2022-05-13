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

  it("Should return gameId and topic after start game", async function () {
    let status = await spinWheelContract.connect(owner).startGame();
    let startGame = await status.wait();

    expect(startGame.events[0].args["topic"].length).to.above(0);
    expect(parseInt(startGame.events[0].args["gameId"])).to.equal(0);

    status = await spinWheelContract.connect(addr1).startGame();
    startGame = await status.wait();

    expect(startGame.events[0].args["topic"].length).to.above(0);
    expect(parseInt(startGame.events[0].args["gameId"])).to.equal(1);
  });

  it("Should return GameStatus after passing gameId to getGameStatus", async function() {
    let status = await spinWheelContract.connect(owner).getGameStatus(0);
    console.log(status["_address"]);
    expect(status["_address"]).to.equal(owner.address);
  })

});
