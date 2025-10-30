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
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    base: {
      url: RPC_URL_BASE,
      accounts,
      chainId: 8453,
    },
    baseSepolia: {
      url: RPC_URL_BASE_SEPOLIA,
      accounts,
      chainId: 84532,
    },
    sepolia: {
      url: RPC_URL_SEPOLIA,
      accounts,
      chainId: 11155111,
    },
  },
  
  etherscan: {
    apiKey: ETHERSCAN_API_KEY, 
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  
  sourcify: { enabled: false },
};

export default config;
