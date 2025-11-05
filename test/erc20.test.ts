import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

describe("MultiVault - ERC20 flows", function () {
  let vault: Contract;
  let owner: any, user: any;
  let token: Contract;

  const toWei = (v: string) => ethers.parseEther(v);

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    // Deploy proxy
    const Fac = await ethers.getContractFactory("MultiVault");
    vault = await upgrades.deployProxy(Fac, [owner.address], {
      kind: "uups",
      initializer: "initialize",
    });
    await vault.waitForDeployment();

    // Deploy mock token and mint to user
    const T = await ethers.getContractFactory("MockERC20");
    token = await T.deploy("Mock USD", "mUSD", 18);
    await token.waitForDeployment();

    await token.mint(user.address, toWei("1000"));
  });

  it("deposits and withdraws ERC20", async () => {
    // approve and deposit
    await token.connect(user).approve(await vault.getAddress(), toWei("150"));
    await vault.connect(user).depositToken(await token.getAddress(), toWei("150"));

    const bal = await vault.balanceOf(user.address, await token.getAddress());
    expect(bal).to.equal(toWei("150"));

    // withdraw part
    await vault.connect(user).withdrawToken(await token.getAddress(), toWei("40"));

    const balAfter = await vault.balanceOf(user.address, await token.getAddress());
    expect(balAfter).to.equal(toWei("110"));
  });

  it("reverts on insufficient balance", async () => {
    await token.connect(user).approve(await vault.getAddress(), toWei("10"));
    await vault.connect(user).depositToken(await token.getAddress(), toWei("10"));
    await expect(
      vault.connect(user).withdrawToken(await token.getAddress(), toWei("11"))
    ).to.be.revertedWith("Insufficient");
  });

  it("pauses deposits/withdrawals", async () => {
    await vault.connect(owner).pause();

    await token.connect(user).approve(await vault.getAddress(), toWei("1"));
    await expect(
      vault.connect(user).depositToken(await token.getAddress(), toWei("1"))
    ).to.be.revertedWithCustomError(vault, "EnforcedPause");

    await expect(
      vault.connect(user).withdrawToken(await token.getAddress(), toWei("1"))
    ).to.be.revertedWithCustomError(vault, "EnforcedPause");
  });
});
