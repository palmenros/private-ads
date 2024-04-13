// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdManager {

  uint constant AD_PRICE = 1;
  uint constant FETCH_BATCH_SIZE = 300;

  struct AdData {
    uint i;
  }

  struct UserData {
    bool isActive;
    uint i;
  }

  struct Ad {
    AdData data;
    uint adsLeft;  // Ads left to serve
    uint showedSinceLastFetch;
  }

  uint nextAdId = 0;
  mapping (uint => Ad) ads;
  uint[] activeAds;     // ids of active ads
  mapping (address => UserData) users;

  /* VIEW FUNCTIONS */
  function _getNextAdId() public view returns (uint) {
    return nextAdId;
  }

  function _getAd(uint id) public view returns (Ad memory) {
    return ads[id];
  }

  function _getUser(address addr) public view returns (UserData memory) {
    return users[addr];
  }

  function _isFraud(address user) private pure returns (bool) {
    /* TODO */
    return false;
  } 

  function getPrice(uint amount) public pure returns (uint) {
    return AD_PRICE * amount;
  }

  function _inference(AdData storage adData, UserData storage userData) view private returns (uint) {
    return adData.i == userData.i ? 1 : 0;
  }

  /**
   * Register a new user.
   */
  function register(UserData calldata userData) public {
    require(!users[msg.sender].isActive, "You are already registered.");
    users[msg.sender] = userData;
    users[msg.sender].isActive = true;
  }

  function postAd(AdData calldata adData, uint amountToShow) external payable {

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
  function getAd() external returns (uint) {
    require(users[msg.sender].isActive, "Inactive user.");
    require(!_isFraud(msg.sender), "Unauthorized user.");

    // Find best ad
    uint max = 0;
    uint bestAdId = 0;
    for (uint i = 0; i < activeAds.length; i++) {

      uint res = _inference(ads[activeAds[i]].data, users[msg.sender]);
      if (max < res) {
        max = res;
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

    // Pay the user
    (bool success, ) = msg.sender.call{value: AD_PRICE}("");
    require(success);

    return bestAdId;

  }

  function getAdsLeft(uint id) public returns (uint) {
    // TODO: implement fetching guard

    require(ads[id].showedSinceLastFetch >= FETCH_BATCH_SIZE, "Wait for the ad to be served enough times.");
    ads[id].showedSinceLastFetch = 0;
    return ads[id].adsLeft;
  }

}
