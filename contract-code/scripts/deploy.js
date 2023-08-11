const { ethers } = require("hardhat"); // Import ethers from Hardhat
const hre = require("hardhat");


async function main() {
  // Deploy Token contract
  const Token = await ethers.getContractFactory("Token");
  const initialWhitelist = [
    "0x2780998f93eAFa3797B31A01E3dEbC0da3F5F495",
    "0x0dd68c06Af920CA069CDc27d05AA9EB65F85990A",
    "0x15127d203C489062fDB62D3FCa3E72172ba80A81",
    "0x1A50bDa9A9cE038a405bD0997a134e422c7Ba474",
    "0x75E027428d09d6740BedDde853a15Ae1db876F53",
    "0x669e9Bfb6471C4e2539203A24f6Af2739459EFa1"
  ];
  const initialSupply = 10000; // Adjust the initial supply as needed
  const token = await Token.deploy("MyToken", "MTK", initialSupply, initialWhitelist);
  // await token.deployed();
  await token.depployed()
  console.log("Token deployed to:", token.address);

  // You can add more code here for interacting with the contract if needed
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
