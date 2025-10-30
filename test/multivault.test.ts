import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

describe("MultiVault", function () {
  let vault: Contract, owner: any, user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Fac = await ethers.getContractFactory("MultiVault");
    vault = await upgrades.deployProxy(Fac, [owner.address], { kind: "uups", initializer: "initialize" });
    await vault.waitForDeployment();
  });

  it("deposits and withdraws native", async () => {
    await owner.sendTransaction({ to: await vault.getAddress(), value: ethers.parseEther("1") });
    expect(await vault.balanceOf(owner.address, ethers.ZeroAddress)).to.equal(ethers.parseEther("1"));
    await vault.withdrawNative(ethers.parseEther("0.4"));
    expect(await vault.balanceOf(owner.address, ethers.ZeroAddress)).to.equal(ethers.parseEther("0.6"));
  });

  it("pauses", async () => {
    await vault.pause();
    await expect(vault.withdrawNative(1)).to.be.reverted;
  });
});
