import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const a of accounts) {
    console.log(await a.getAddress());
  }
});
