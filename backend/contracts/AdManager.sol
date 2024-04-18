// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdManager {

  uint constant AD_PRICE = 1;
  uint constant FETCH_BATCH_SIZE = 300;

  uint constant SALARY_WEIGHT = 1;
  uint constant AGE_WEIGHT = 1000;
  /* TODO: BETTER WEIGHTS */
  uint constant WORD_EMBEDDING_WEIGHT = 1;
  uint constant LOCATION_WEIGHT = 1;

  struct AdData {
    uint age;
    uint salary;
    int xWordEmbedding;
    int yWordEmbedding;
    int xLocation;
    int yLocation;
    int zLocation;
    string url;
  }

  struct UserData {
    uint age;
    uint salary;
    int xWordEmbedding;
    int yWordEmbedding;
    int xLocation;
    int yLocation;
    int zLocation;
    bool isActive;
  }

  struct Ad {
    AdData data;
    uint adsLeft;  // Ads left to serve
    uint showedSinceLastFetch;
  }

  uint private nextAdId = 0;
  mapping (uint => Ad) private ads;
  uint[] private activeAds;     // ids of active ads

  mapping (address => string) private lastAdUrl; // url of the last ad served to a user

  /****** VIEW FUNCTIONS ******/
  function _getNextAdId() public view returns (uint) {
    return nextAdId;
  }

  function _getAd(uint id) public view returns (Ad memory) {
    return ads[id];
  }

  function _getUrl() public view returns (string memory) {
    return lastAdUrl[msg.sender];
  }

  /**
   * Checks if a user is malicious.
   * @param user user to check
   */
  function _isFraud(address user) private pure returns (bool) {
    /* TODO */
    return false;
  } 

  function getPrice(uint amount) public pure returns (uint) {
    return AD_PRICE * amount;
  }

  /**
   * Returns the absolute value of an int.
   */
  function _abs(int x) private pure returns (uint) {
    return x >= 0 ? uint(x) : uint(-x);
  }

  /**
   * Return the distance between the given Ad and the given Data. Used for KNN ad-user matching.
   * All computations are done on integers (pre-scaled off-chain and converted from floating point).
   * @param adData data of the ad 
   * @param userData data of the user
   */
  function _inference(AdData memory adData, UserData memory userData) pure public returns (uint) {

    uint deltaAge = _abs(int(adData.age) - int(userData.age)) * AGE_WEIGHT;

    uint deltaSalary = _abs(int(adData.salary) - int(userData.salary)) * SALARY_WEIGHT;

    uint deltaWordEmbedding = (
      uint((adData.xWordEmbedding - userData.xWordEmbedding) ** 2) + 
      uint((adData.yWordEmbedding - userData.yWordEmbedding) ** 2)
      ) * WORD_EMBEDDING_WEIGHT;

    uint deltaLocation = (
      uint((adData.xLocation - userData.xLocation) ** 2) + 
      uint((adData.yLocation - userData.yLocation) ** 2) +
      uint((adData.zLocation - userData.zLocation) ** 2)
      ) * LOCATION_WEIGHT;

    return deltaAge + deltaSalary + deltaWordEmbedding + deltaLocation;

  }

  /**
   * Post an ad to serve
   * @param adData data of the ad to post
   * @param amountToShow number of ads to serve
   */
  function postAd(AdData memory adData, uint amountToShow) public payable {

    // Check that the amount payed to post the ad is correct
    require(msg.value == getPrice(amountToShow), "Wrong msg.value.");
    require(amountToShow > 0, "Amount must be greater than 0.");

    // Store ad
    ads[nextAdId] = Ad(
      adData,
      amountToShow,
      0);

    activeAds.push(nextAdId);

    nextAdId++;

  }

  /**
   * Serve the best ad to the user, the user gets the money in return.
   * The ad counter is decremented and if it reaches zero it is removed from active ads.
   */
  function getAd(UserData calldata userData) external {
    require(!_isFraud(msg.sender), "Unauthorized user.");

    // Find best ad
    uint min = type(uint).max;
    uint bestAdId = 0;

    require(activeAds.length > 0, "There are no Ads to show.");

    for (uint i = 0; i < activeAds.length; i++) {

      uint res = _inference(ads[activeAds[i]].data, userData);
      if (min > res) {
        min = res;
        bestAdId = activeAds[i];
      }
      
    }

    ads[bestAdId].adsLeft--;
    ads[bestAdId].showedSinceLastFetch++;

    // Remove it from active ads
    if (ads[bestAdId].adsLeft == 0) {

      for (uint i = 0; i < activeAds.length; i++) {

        if (activeAds[i] == bestAdId) {
          // move the last element to the free position then pop
          activeAds[i] = activeAds[activeAds.length - 1];
          activeAds.pop();
        }

      }

    }

    // Store the URL of the ad to serve
    lastAdUrl[msg.sender] = ads[bestAdId].data.url;

    // Pay the user
    (bool success, ) = msg.sender.call{value: AD_PRICE}("");
    require(success);

  }

  function getAdsLeft(uint id) public returns (uint) {

    require(ads[id].showedSinceLastFetch >= FETCH_BATCH_SIZE, "Wait for the ad to be served enough times.");

    ads[id].showedSinceLastFetch = 0;

    return ads[id].adsLeft;

  }

}
