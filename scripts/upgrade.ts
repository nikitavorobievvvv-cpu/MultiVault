import { ethers, upgrades } from "hardhat";

async function main() {
  const proxy = "0x03e83C17D6eD400aA23779a9893522859E12a4C"; // твой прокси
  const Contract = await ethers.getContractFactory("MultiVault"); // имя контракта

  await upgrades.forceImport(proxy, Contract);

  const upgraded = await upgrades.upgradeProxy(proxy, Contract);
  await upgraded.waitForDeployment();

  console.log("Upgraded proxy at:", await upgraded.getAddress());
}

main().catch((e) => process.exit(1));
