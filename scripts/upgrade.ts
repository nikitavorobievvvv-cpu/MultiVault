import { ethers, upgrades } from "hardhat";
import fs from "fs";
import path from "path";

type Manifest = {
  chainId: number;
  network: string;
  proxy: string;
  implementation?: string;
  contractName: string;
  lastUpgrade?: {
    implementation: string;
    block?: number;
    txHash?: string;
    timestamp?: string;
  };
};

async function main() {
  const net = await ethers.provider.getNetwork();
  const chainId = Number(net.chainId.toString());
  const manifestPath = path.join(process.cwd(), "deployments", `${chainId}.json`);
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing deployments manifest for chainId ${chainId}`);
  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest: Manifest = JSON.parse(raw);
  if (!manifest.proxy) throw new Error("Missing proxy address in manifest");
  if (!manifest.contractName) throw new Error("Missing contractName in manifest");

  const Factory = await ethers.getContractFactory(manifest.contractName);
  const upgraded = await upgrades.upgradeProxy(manifest.proxy, Factory, { kind: "uups" });
  await upgraded.waitForDeployment();

  const impl = await upgrades.erc1967.getImplementationAddress(await upgraded.getAddress());
  const block = await ethers.provider.getBlock("latest");

  manifest.implementation = impl;
  manifest.lastUpgrade = {
    implementation: impl,
    block: block?.number,
    txHash: upgraded.deploymentTransaction()?.hash,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Upgraded proxy ${manifest.proxy} to implementation ${impl} on chain ${chainId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
