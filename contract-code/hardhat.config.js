// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");
// require("npm i @openzeppelin/hardhat-upgrades");
require("dotenv").config();
// require('hardhat-contract-sizer');
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require('hardhat-deploy-ethers');

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: process.env.DEBUG ? false : true },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // blockGasLimit: 518379120000 // whatever you want here
    },
    maticmumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [
        process.env.PRIVATE_KEY_1
      ],
      // blockGasLimit: 518379120000 // whatever you want here
    }
  },
  etherscan: {
    // Your API key for Etherscan - rinkeby
    // Obtain one at https://etherscan.io/
    apiKey: "HBMB8ER9AI26GMHR2IAGYK6KS3AX3FA6J1"
  },
  etherscan: {
  //   // Your API key for Etherscan - matic
  //   // Obtain one at https://etherscan.io/
  //   apiKey: process.env.ETHERSCAN_API,
  //   // apiKey: process.env.ETHERSCAN_API,
    apiKey: {
      polygonMumbai: "G23YP8VZFF95Y5S7VZJRP653YPXQE2GGVM",
    },
  },
};