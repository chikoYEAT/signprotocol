require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"] ,
      chainId: 31337
    },
  },
  paths: {
    artifacts: './src/artifacts',
  },
};
