![Header](./Banner.png)

# PrivAds

Get personalized ads while preserving the privacy of your data.

## Table of Contents

- [About](#about)
- [Testing](#testing)

## About

This project aims to develop a decentralized application (DApp) that leverages machine learning algorithms to serve targeted advertisements while prioritizing user privacy. Traditional advertising methods often compromise user data privacy, leading to concerns about data exploitation and unauthorized access. By utilizing Oasis confidential blockchain technology and machine learning techniques, PrivAd seeks to address these concerns by ensuring that user data remains encrypted and anonymous throughout the ad-serving process.

PrivAd employs a combination of smart contracts, decentralized storage solutions, and machine learning models to analyze user behavior and preferences without giving advertisers access to user's sensitive personal information.

Key features of PrivAd include:
- Privacy-preserving targeted ads: The user's private data is fully processed inside a confidential smart contract. The advertisers have no access to the user's data, nor they know which user saw which ad, to prevent tracking.
- Support for anti-fraud models: The confidential smart contract has access to all user information, so existing anti-fraud models can be implemented in the smart contract that keep the data confidential but protect the advertisers' interests.
- On-chain ML: A simple on-chain KNN machine learning algorithm is run on-chain to match the user data with the available advertisements without disclosing private data. To reduce gas consumption, the dimensionality of the data is severely reduced.
- Extremely low-dimensional word embeddings: In order to support text-based on-chain machine learning models while keeping gas usage at an acceptable level, we have used state-of-the-art word embeddings such as Word2Vec and reduced the output dimensionality from 300 dimensions to 2 dimensions by using t-SNE. This embedding is executed off-chain, and the on-chain KNN ML algorithm only needs to compute the distance between 2 dimensions, greatly reducing the computational complexity and enabling on-chain text-based ML algorithms.  
- User financial rewards: The user's get a financial reward when consuming targeted ads, sharing the ad revenue.
- Transparent ad-serving process: Smart contracts govern the ad-serving process, providing transparency to both advertisers and users. The smart contract code is open source and can be audited by all parties, given both users and advertisers trust on it.
- Opt-in participation: Users have control over their data and can choose to opt-in or opt-out of the targeted advertising program at any time.

By combining the power of confidential blockchain and machine learning, PrivAd aims to revolutionize the digital advertising industry by offering a more privacy-focused and user-centric approach to targeted advertising.

## Testing

Find tests under the `backend/test/` directory. To run tests use the following command:
```
npx hardhat test
```