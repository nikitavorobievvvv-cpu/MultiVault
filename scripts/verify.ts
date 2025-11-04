import { network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const net = process.argv[2] || network.name;
  const file = path.join("deployments", `${net}.json`);
  if (!fs.existsSync(file)) throw new Error(`Deploy file not found: ${file}`);

  const { implementation } = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!implementation) throw new Error("No implementation address in deploy file");

  console.log(`[verify] network=${net} impl=${implementation}`);
  await run("verify:verify", { address: implementation });
  console.log("[verify] done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
