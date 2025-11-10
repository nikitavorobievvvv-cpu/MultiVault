import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "@typechain/hardhat";

const PK = process.env.PRIVATE_KEY || "";
const accounts = PK ? [PK] : [];

// Универсальные фолбэки: сначала RPC_URL (который пробрасывает workflow),
// затем именованные секреты репозитория, затем пустая строка.
const RPC_URL_UNIVERSAL = process.env.RPC_URL || "";
const RPC_URL_BASE =
  RPC_URL_UNIVERSAL ||
  process.env.RPC_URL_BASE ||
  process.env.BASE_RPC_MAINNET ||
  "";
const RPC_URL_BASE_SEPOLIA =
  RPC_URL_UNIVERSAL ||
  process.env.RPC_URL_BASE_SEPOLIA ||
  process.env.BASE_RPC_SEPOLIA ||
  "";

const ETHERSCAN = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    base: {
      url: RPC_URL_BASE,
      accounts
    },
    basesepolia: {
      url: RPC_URL_BASE_SEPOLIA,
      accounts
    }
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN,
      basesepolia: ETHERSCAN
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
