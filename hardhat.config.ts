import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";

const RPC_URL_BASE = process.env.RPC_URL_BASE ?? "";
const RPC_URL_BASE_SEPOLIA = process.env.RPC_URL_BASE_SEPOLIA ?? "";
const RPC_URL_SEPOLIA = process.env.RPC_URL_SEPOLIA ?? "";

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    base: {
      url: RPC_URL_BASE,
      accounts
    },
    baseSepolia: {
      url: RPC_URL_BASE_SEPOLIA,
      accounts
    },
    sepolia: {
      url: RPC_URL_SEPOLIA,
      accounts
    }
  },
  etherscan: {
    // Basescan/Etherscan compatible API
    apiKey: {
      base: ETHERSCAN_API_KEY,
      baseSepolia: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
};

export default config;
