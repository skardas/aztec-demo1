require("@nomiclabs/hardhat-waffle");



const PRIVATE_KEY = "c0a165a65069b7ba0590f2b243228d1169d547374dd1c2114e72c6d17bc96d1f";


module.exports = {
  defaultNetwork: "paributest",
  networks: {
    hardhat: {
      gas: 5500000,
      gasPrice: 18000000000,
      blockGasLimit: 25000000,
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      accounts: [PRIVATE_KEY]
    },
    paributest: {
      url: "https://rpc.testnet.paribuscan.com",
      chainId: 3500,
      accounts: [PRIVATE_KEY],
      from: "0xeb1425aaC16fdCF7962393a061561F486B87Decb",
      network_id: 3500,
      gas: 5500000,
      gasPrice: 18000000000,
      confirmations: 2,
      skipDryRun: true,
    }
  },
  solidity: {
    version: "0.5.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: 'constantinople'
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}
