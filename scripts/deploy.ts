import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const MultiVault = await ethers.getContractFactory("MultiVault");
  const proxy = await upgrades.deployProxy(MultiVault, [deployer.address], {
    kind: "uups",
    initializer: "initialize"
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  console.log("MultiVault proxy deployed to:", proxyAddress);

  const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation:", impl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
