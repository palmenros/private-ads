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
    const adData = {
      age: BigInt(42), 
      salary: BigInt(4200), 
      xWordEmbedding: 42,
      yWordEmbedding: 42,
      xLocation: 42,
      yLocation: 42,
      zLocation: 42,
      url: "https://example.com"
    };
    const amountToShow: bigint = BigInt(100); // example amount to show
    const price = await adManager.getPrice(amountToShow); // calculate the price

    // Post an ad
    const id = await adManager._getNextAdId();
    await adManager.postAd(adData, amountToShow, { value: price });

    // Get the last ad
    const lastAd = await adManager._getAd(id);

    // Check if the ad was stored correctly
    expect(lastAd.adsLeft).to.equal(amountToShow);
  });

  it("Should infere 0", async function () {
    const { adManager } = await deployAdManager();
    const adData = {
      age: BigInt(42), 
      salary: BigInt(4200), 
      xWordEmbedding: 42,
      yWordEmbedding: 42,
      xLocation: 42,
      yLocation: 42,
      zLocation: 42,
      url: "https://example.com"
    };
    const amountToShow: bigint = BigInt(100); // example amount to show
    const price = await adManager.getPrice(amountToShow); // calculate the price

    // Post an ad
    const id = await adManager._getNextAdId();
    await adManager.postAd(adData, amountToShow, { value: price });

    // Check if the ad was stored correctly
    const userData = {
      age: BigInt(42), 
      salary: BigInt(4200), 
      xWordEmbedding: 42,
      yWordEmbedding: 42,
      xLocation: 42,
      yLocation: 42,
      zLocation: 42,
      isActive: true
    };
    const res = await adManager._inference(adData, userData);
    expect(res).to.equal(BigInt(0));
  });

  it("Should infere 42", async function () {
    const { adManager } = await deployAdManager();
    const amountToShow: bigint = BigInt(100); // example amount to show
    const adData = {
      age: BigInt(30), 
      salary: BigInt(3000), 
      xWordEmbedding: 42,
      yWordEmbedding: 42,
      xLocation: 42,
      yLocation: 42,
      zLocation: 42,
      url: "https://example.com"
    };
    const price = await adManager.getPrice(amountToShow); // calculate the price

    // Post an ad
    const id = await adManager._getNextAdId();
    await adManager.postAd(adData, amountToShow, { value: price });

    // Check if the ad was stored correctly
    const userData = {
      age: BigInt(42), 
      salary: BigInt(4200), 
      xWordEmbedding: 42,
      yWordEmbedding: 42,
      xLocation: 42,
      yLocation: 42,
      zLocation: 42,
      isActive: true
    };
    const res = await adManager._inference(adData, userData);
    expect(res).to.equal(BigInt(13200));
  });
});