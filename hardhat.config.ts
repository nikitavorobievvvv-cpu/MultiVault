import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "@typechain/hardhat";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RPC_BASE = process.env.RPC_URL || process.env.BASE_RPC_MAINNET || "";
const RPC_BASESEPOLIA = process.env.BASE_RPC_SEPOLIA || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    base: {
      url: RPC_BASE,
      accounts
    },
    basesepolia: {
      url: RPC_BASESEPOLIA,
      accounts
    }
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN_API_KEY,
      basesepolia: ETHERSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || ""
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  }
};

export default config;
