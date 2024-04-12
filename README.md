# Oasis Starter dApp

This is a skeleton for confidential Oasis dApps:

- `backend` contains the example MessageBox solidity contract, deployment and
  testing utils.
- `frontend` contains a Vue-based web application communicating with the
  backend smart contract.

This monorepo is set up for `pnpm`. Install dependencies by running:

```sh
pnpm install
```

## Backend

Move to the `backend` folder and build smart contracts:

```sh
pnpm build
```

Next, deploy the contract.

### Basic Local Hardhat Deployment

Start the hardhat node:

```sh
npx hardhat node
```

Deploy smart contracts to that local network:

```sh
npx hardhat deploy --network sapphire-localnet
```

To execute a task from the command line to call the smart contract, define it using a `task` inside `backend/hardhat.config.ts` and pass the contract address when deployed. For example, for `task('message')`:
```sh
npx hardhat message --network sapphire-localnet 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

The deployed MessageBox address will be reported. Remember it and store it
inside the `frontend` folder's `.env.development`, for example:

```
VITE_MESSAGE_BOX_ADDR=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_NETWORK=0x539
VITE_WEB3_GATEWAY=http://localhost:8545
```

### Deploying to Sapphire Localnet, Testnet and Mainnet

Prepare your hex-encoded private key and store it as an environment variable:

```shell
export PRIVATE_KEY=0x...
```

To deploy the contracts to the [Sapphire Localnet], Testnet or Mainnet, use the
following commands respectively:

```shell
npx hardhat deploy --network sapphire-localnet
npx hardhat deploy --network sapphire-testnet
npx hardhat deploy --network sapphire
```

[Sapphire Localnet]: https://github.com/oasisprotocol/oasis-web3-gateway/pkgs/container/sapphire-dev

## Frontend

After you compiled the backend, updated `.env.development` with the
corresponding address and a chain ID, move to the `frontend` folder, compile
and Hot-Reload frontend for Development:

```sh
pnpm dev
```

Navigate to http://localhost:5173 with your browser to view your dApp. Some
browsers (e.g. Brave) may require https connection and a CA-signed certificate
to access the wallet. In this case, read the section below on how to properly
deploy your dApp.

You can use one of the deployed test accounts and associated private key with
MetaMask. If you use the same MetaMask accounts on fresh local networks such as
Hardhat Node, Foundry Anvil or sapphire-dev docker image, don't forget to
*clear your account's activity* each time or manually specify the correct
account nonce.

### Frontend Deployment

You can build assets for deployment by running:

```sh
pnpm build
```

`dist` folder will contain the generated HTML files that can be hosted.

#### Different Website Base

If you are running dApp on a non-root base dir, add

```
BASE_DIR=/my/public/path
```

to `.env.production` and bundle the app with

```
pnpm build-only --base=/my/public/path/
```

Then copy the `dist` folder to a place of your `/my/public/path` location.
