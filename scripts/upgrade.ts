import { ethers, upgrades } from "hardhat";

// Set your previously deployed proxy here or pass via env/CLI
const PROXY_ADDRESS = process.env.PROXY_ADDRESS || "";

async function main() {
  if (!PROXY_ADDRESS) throw new Error("Set PROXY_ADDRESS env var");

  const MultiVaultV2 = await ethers.getContractFactory("MultiVault");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, MultiVaultV2);
  await upgraded.waitForDeployment();

  const proxyAddress = await upgraded.getAddress();
  const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Upgraded proxy:", proxyAddress);
  console.log("New implementation:", impl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
