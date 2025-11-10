import { ethers, upgrades } from "hardhat";
import fs from "fs";
import path from "path";

type Manifest = {
  chainId: number;
  network: string;
  proxy: string;
  implementation?: string;
  contractName: string;
  deployedAt?: { block?: number; txHash?: string; timestamp?: string };
  lastUpgrade?: { implementation: string; block?: number; txHash?: string; timestamp?: string };
  pattern?: string;
};

async function main() {
  const net = await ethers.provider.getNetwork();
  const chainId = Number(net.chainId);
  const manifestPath = path.join(process.cwd(), "deployments", `${chainId}.json`);
  if (!fs.existsSync(manifestPath)) throw new Error(`deployments/${chainId}.json not found`);
  const data = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
  if (!data.proxy) throw new Error("proxy address missing in manifest");
  if (!data.contractName) throw new Error("contractName missing in manifest");

  const Factory = await ethers.getContractFactory(data.contractName);
  await upgrades.forceImport(data.proxy, Factory, { kind: "uups" });

  const upgraded = await upgrades.upgradeProxy(data.proxy, Factory, { kind: "uups" });
  await upgraded.waitForDeployment();

  const impl = await upgrades.erc1967.getImplementationAddress(data.proxy);
  const block = await ethers.provider.getBlock("latest");
  data.implementation = impl;
  data.lastUpgrade = {
    implementation: impl,
    block: block?.number,
    txHash: upgraded.deploymentTransaction()?.hash || "",
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
  console.log(`OK ${data.proxy} -> ${impl}`);
}

main().catch(() => process.exit(1));
