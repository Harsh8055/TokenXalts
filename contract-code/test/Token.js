const { expect } = require("chai");
// const  ethers  = require("ethers");
const hre = require("hardhat");
// const { ethers } = hre;

describe("Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await hre.ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

  // let Token, token, owner, addr1, addr2;
    token = await Token.deploy("MyToken", "MTK", hre.ethers.parseEther("1000"), [addr1.address, addr2.address ]);
    // await token.deployed();
  });

  it("should have the correct name, symbol, and initial supply", async function () {
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
    // expect(await token.totalSupply()).to.equal(hre.ethers.parseEther("1000"));
  });

  it("should whitelist initial addresses", async function () {
    expect(await token.isWhitelisted(addr1.address)).to.be.true;
    expect(await token.isWhitelisted(addr2.address)).to.be.true;
  });

  it("should blacklist and whitelist addresses", async function () {
    await token.blacklist(addr1.address);
    expect(await token.isBlacklisted(addr1.address)).to.be.true;
    expect(await token.isWhitelisted(addr1.address)).to.be.false;

    await token.whitelist(addr1.address);
    expect(await token.isWhitelisted(addr1.address)).to.be.true;
    expect(await token.isBlacklisted(addr1.address)).to.be.false;
  });

  it("should transfer tokens between whitelisted addresses", async function () {
    const initialBalance = await token.balanceOf(addr1.address);
    console.log("initialBalance", initialBalance.toString());
    const amount = hre.ethers.parseEther("1");

    await token.connect(addr1).transfer(addr2.address, amount);
    const newBalance1 = await token.balanceOf(addr1.address);
    const newBalance2 = await token.balanceOf(addr2.address);

    console.log("newBalance1", newBalance1.toString());
    console.log("newBalance2", newBalance2.toString());

    // expect(newBalance1).to.equal(initialBalance.sub(amount));
    // expect(newBalance2).to.equal(amount);
  });

  it("should not transfer tokens to or from blacklisted addresses", async function () {
    await token.blacklist(addr1.address);

    const amount = hre.ethers.parseEther("100");

    await expect(token.connect(addr1).transfer(addr2.address, amount)).to.be.revertedWith("not whitelisted");
    await expect(token.connect(addr2).transfer(addr1.address, amount)).to.be.revertedWith("Recipient is blacklisted");
  });

  it("should record peer interactions", async function () {
    await token.connect(addr1).transfer(addr2.address, hre.ethers.parseEther("100"));

    const directPeers = await token.directPeers(addr1.address);
    expect(directPeers).to.deep.equal([addr2.address]);

    const directPeers2 = await token.directPeers(addr2.address);
    expect(directPeers2).to.deep.equal([addr1.address]);
  });
});
