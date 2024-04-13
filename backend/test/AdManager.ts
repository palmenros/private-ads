import { expect } from "chai";
import { ethers } from "hardhat";

describe("AdManager", function () {
  async function deployAdManager() {
    const AdManager_factory = await ethers.getContractFactory("AdManager");
    const adManager = await AdManager_factory.deploy();
    await adManager.waitForDeployment();
    return { adManager };
  }

  it("Should post an ad", async function () {
    const { adManager } = await deployAdManager();
    const adData = {i: 0};
    const amountToShow: bigint = BigInt(100); // example amount to show
    const price = await adManager.getPrice(amountToShow); // calculate the price

    // Post an ad
    const id = await adManager._getNextAdId();
    await adManager.postAd(adData, amountToShow, { value: price });

    // Get the last ad
    const lastAd = await adManager._getAd(id);

    // Check if the ad was stored correctly
    expect(lastAd.adsLeft).to.equal(amountToShow);
    // Add more checks for other properties of the ad if necessary
  });
});