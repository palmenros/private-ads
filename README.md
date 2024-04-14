![Header](./Banner.png)

# PrivAds

Get personalized ads while preserving the privacy of your data.

## Table of Contents

- [About](#about)
- [Testing](#testing)

## About

PrivAds leverages the Oasis confidential blockchain and machine learning algorithms to serve targeted advertisements while prioritizing user privacy. Traditional advertising methods often compromise user data privacy, leading to concerns about data leaks and unauthorized access and selling of data. PrivAd addresses these concerns by ensuring that user data remains encrypted and anonymous throughout the ad-serving process. The advertisers in no moment have access to the user's private data, which is only used inside the confidential smart contract to serve personalized ads.

PrivAds employs a combination of smart contracts, decentralized storage solutions, and machine learning models to analyze user behavior and preferences without giving advertisers access to user's sensitive personal information.

Key features of PrivAds include:
- **Privacy-preserving targeted ads**: The user's private data is fully processed inside a confidential smart contract executing in a Trusted Execution Environment. The advertisers have no access to the user's data, nor they know which user saw which ad, to prevent tracking.
- **Support for anti-fraud models**: The confidential smart contract has access to all user information, so existing anti-fraud models can be implemented in the smart contract that keep the data confidential but protect the advertisers' interests.
- **On-chain ML**: A simple on-chain KNN machine learning algorithm is run on-chain to match the user data with the available advertisements without disclosing private data. To reduce gas consumption, the dimensionality of the data is severely reduced.
- **Extremely low-dimensional word embeddings**: In order to support text-based on-chain machine learning models while keeping gas usage at an acceptable level, we have used state-of-the-art word embeddings such as Word2Vec and reduced the output dimensionality from 300 dimensions to 2 dimensions by using t-SNE. This embedding is executed off-chain, and the on-chain KNN ML algorithm only needs to compute the distance between 2 dimensions, greatly reducing the computational complexity and enabling on-chain text-based ML algorithms.  
- **User financial rewards**: The user's get a financial reward when consuming targeted ads, sharing the ad revenue.
- **Transparent ad-serving process**: Smart contracts govern the ad-serving process, providing transparency to both advertisers and users. The smart contract code is open source and can be audited by all parties, given both users and advertisers trust on it.
- **Advertiser cross-tracking protection**: Thanks to the confidential smart contract, advertisers don't know which users saw their ads, as they could try to infer information from users that way. Instead, they can only see aggregated statistics about their ad campaign. Despite not having access to this information, they can still rely on the anti-fraud model, which does have access to private user data.
- **IPFS storage for ad-content**: Only compact ad identifiers are stored inside the blockchain to reduce on-chain storage size. The ad contents are stored in an IPFS storage (our prototype uses instead a simple Python static server). Existing privacy-preserving IPFS solutions can be leveraged to fetch the ad content with the given ID. 
- **Opt-in participation**: Users have control over their data and can choose to opt-in or opt-out of the targeted advertising program at any time.

By combining the power of confidential blockchain and machine learning, PrivAds aims to revolutionize the digital advertising industry by offering a more privacy-focused and user-centric approach to targeted advertising.

## Repository structure

- `backend` contains the example `AdManager` solidity contract, deployment and
  testing utils and CLI commands to interact with the smart contract.
- `frontend` contains a Vue-based web application communicating with the
  backend smart contract.
- `ad_server` contains the code for a Flask application that is used in the prototype to serve static ad content with a given ad URL. In the future, this will be stored in IPFS storage.
- `nlp` contains the Python jupyter notebook code used for the Machine Learning word embedding dimensionality reduction.

## Running, testing and deploying

First, install dependencies using `pnpm`:

```sh
pnpm install
```

### Backend

Move to the `backend` folder and build smart contracts:

```sh
pnpm build
```

Start a Sapphire localnet by using Docker:

```sh
docker run -it -p8545:8545 -p8546:8546 ghcr.io/oasisprotocol/sapphire-localnet
```

Export the private key of a localnet account to deploy the smart contract:

```sh
export PRIVATE_KEY=0x...
```

Deploy the smart contract to that local network:
```sh
npx hardhat deploy --network sapphire-localnet
```

The deployed AdManager contract address will be reported. Remember it and store it
inside the `frontend` folder's `.env.development`, for example:

```
VITE_MESSAGE_BOX_ADDR=0xCONTRACT_ADDRESS
VITE_NETWORK=0x5afd
VITE_WEB3_GATEWAY=http://localhost:8545
```

To execute a task from the command line to call the smart contract, explore `backend/hardhat.config.ts` for available `task`s and pass the contract address when deployed. For example, for running `task('example')`:
```sh
npx hardhat example --network sapphire-localnet 0xCONTRACT_ADDRESS
```

Find tests under the `backend/test/` directory. To run tests use the following command:
```
npx hardhat test
```

### Frontend

First, run the flask static content ad server that returns the ad content for a given ad URL, by moving into `ad_server` and executing:

```sh
flask --app server.py run
```

After you compiled the backend, updated `.env.development` with the
corresponding address and a chain ID, move to the `frontend` folder, compile
and Hot-Reload frontend for Development:

```sh
pnpm dev
```

You can use one of the deployed test accounts and associated private key with
MetaMask.
