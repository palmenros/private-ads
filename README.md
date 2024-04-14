![Header](./Banner.png)

# PrivAd

Get personalized ads while preserving the privacy of your data.

## Table of Contents
- [About](#about)
- [Testing](#testing)

## About

This project aims to develop a decentralized application (DApp) that leverages machine learning algorithms to serve targeted advertisements while prioritizing user privacy. Traditional advertising methods often compromise user data privacy, leading to concerns about data exploitation and unauthorized access. By utilizing Oasis confidential blockchain technology and machine learning techniques, PrivAd seeks to address these concerns by ensuring that user data remains encrypted and anonymous throughout the ad-serving process.

PrivAd employs a combination of smart contracts, decentralized storage solutions, and machine learning models to analyze user behavior and preferences without giving advertisers access to user's sensitive personal information.

Key features of PrivAd include:
- 
- Privacy-preserving local ML: Open source machine learning algorithms are runned locally to analyze user data without disclosing sensitive data.
- Transparent ad-serving process: Smart contracts govern the ad-serving process, providing transparency to both advertisers and users.
- Opt-in participation: Users have control over their data and can choose to opt-in or opt-out of the targeted advertising program at any time.

By combining the power of blockchain and machine learning, PrivAd aims to revolutionize the digital advertising industry by offering a more privacy-focused and user-centric approach to targeted advertising.

## Testing

Find tests under the `backend/test/` directory. To run tests use the following command:
```
npx hardhat test
```