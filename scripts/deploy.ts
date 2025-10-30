import { ethers, upgrades, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const MultiVault = await ethers.getContractFactory("MultiVault");

  // Deploy UUPS proxy
  const proxy = await upgrades.deployProxy(MultiVault, [deployer.address], {
    kind: "uups",
    initializer: "initialize",
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  console.log("MultiVault proxy deployed to:", proxyAddress);

  // Try to resolve implementation with retries (some RPCs need a tiny delay)
  let implAddress: string | null = null;
  const maxAttempts = 5;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
      break;
    } catch (err) {
      if (i === maxAttempts) {
        console.warn(
          `WARN: Failed to read implementation after ${maxAttempts} attempts. You can verify later using the proxy address.`,
        );
      } else {
        await sleep(3000);
      }
    }
  }

  if (implAddress) {
    console.log("Implementation:", implAddress);
  }

  // Persist addresses for CI/verification
  const outDir = path.join("deployments");
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.mkdirSync(outDir, { recursive: true });
  const payload = {
    network: network.name,
    proxy: proxyAddress,
    implementation: implAddress,
    timestamp: Math.floor(Date.now() / 1000),
  };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  console.log(`Saved deployment: ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
