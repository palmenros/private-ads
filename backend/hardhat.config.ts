import { promises as fs } from 'fs';
import path from 'path';

import '@nomicfoundation/hardhat-ethers';
import '@oasisprotocol/sapphire-hardhat';
import '@typechain/hardhat';
import canonicalize from 'canonicalize';
import {JsonRpcProvider} from "ethers";
import 'hardhat-watcher';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';

const TASK_EXPORT_ABIS = 'export-abis';

task(TASK_COMPILE, async (_args, hre, runSuper) => {
  await runSuper();
  await hre.run(TASK_EXPORT_ABIS);
});

task(TASK_EXPORT_ABIS, async (_args, hre) => {
  const srcDir = path.basename(hre.config.paths.sources);
  const outDir = path.join(hre.config.paths.root, 'abis');

  const [artifactNames] = await Promise.all([
    hre.artifacts.getAllFullyQualifiedNames(),
    fs.mkdir(outDir, { recursive: true }),
  ]);

  await Promise.all(
    artifactNames.map(async (fqn) => {
      const { abi, contractName, sourceName } = await hre.artifacts.readArtifact(fqn);
      if (abi.length === 0 || !sourceName.startsWith(srcDir) || contractName.endsWith('Test'))
        return;
      await fs.writeFile(`${path.join(outDir, contractName)}.json`, `${canonicalize(abi)}\n`);
    }),
  );
});

// Unencrypted contract deployment.
task('deploy')
  .setAction(async (args, hre) => {
    await hre.run('compile');

    // For deployment unwrap the provider to enable contract verification.
    const uwProvider = new JsonRpcProvider(hre.network.config.url);
    const AdManager = await hre.ethers.getContractFactory('AdManager', new hre.ethers.Wallet(accounts[0], uwProvider));
    const adManager= await AdManager.deploy();
    await adManager.waitForDeployment();

    console.log(`AdManager address: ${await adManager.getAddress()}`);
    return adManager;
});

// Define the task to post an ad
task('postAd', 'Post an ad to serve')
  .addParam('age', 'Age parameter')
  .addParam('salary', 'Salary parameter')
  .addParam('url', 'Url parameter')
  .addParam('amountToShow', 'Number of ads to serve')
  .addPositionalParam('xWordEmbedding', 'X word embedding parameter')
  .addPositionalParam('yWordEmbedding', 'Y word embedding parameter')
  .addPositionalParam('xLocation', 'X location parameter')
  .addPositionalParam('yLocation', 'Y location parameter')
  .addPositionalParam('zLocation', 'Z location parameter')
  .addPositionalParam('address', 'contract address')
  .setAction(async (args, hre) => {
    //const [signer]: SignerWithAddress[] = await hre.ethers.getSigners();
    const adManager = await hre.ethers.getContractAt('AdManager', args.address);
    const price = await adManager.getPrice(args.amountToShow);

    // Call the postAd function
    const adData = {
      age: args.age,
      salary: args.salary,
      xWordEmbedding: args.xWordEmbedding,
      yWordEmbedding: args.yWordEmbedding,
      xLocation: args.xLocation,
      yLocation: args.yLocation,
      zLocation: args.xLocation,
      url: args.url
    };
    const tx = await adManager.postAd(adData, args.amountToShow, { value: price });
    await tx.wait();

    console.log("Ad posted successfully.");
  });

// Define the task to post an ad
task('getAd', 'Get an ad to serve')
  .addParam('age', 'Age parameter')
  .addParam('salary', 'Salary parameter')
  .addPositionalParam('xWordEmbedding', 'X word embedding parameter')
  .addPositionalParam('yWordEmbedding', 'Y word embedding parameter')
  .addPositionalParam('xLocation', 'X location parameter')
  .addPositionalParam('yLocation', 'Y location parameter')
  .addPositionalParam('zLocation', 'Z location parameter')
  .addPositionalParam('address', 'contract address')
  .setAction(async (args, hre) => {
    const adManager = await hre.ethers.getContractAt('AdManager', args.address);
    const userData = {
      age: args.age, 
      salary: args.salary, 
      xWordEmbedding: args.xWordEmbedding,
      yWordEmbedding: args.yWordEmbedding,
      xLocation: args.xLocation,
      yLocation: args.yLocation,
      zLocation: args.xLocation,
      isActive: true
    };

    // Call the postAd function
    const tx = await adManager.getAd(userData);
    await tx.wait();

    const url = await adManager._getUrl();
    console.log(url);
  });

// Hardhat Node and sapphire-dev test mnemonic.
const TEST_HDWALLET = {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET;

const config: HardhatUserConfig = {
  networks: {
    hardhat: { // https://hardhat.org/metamask-issue.html
      chainId: 1337,
    },
    'sapphire': {
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe,
      accounts,
    },
    'sapphire-testnet': {
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff,
      accounts,
    },
    'sapphire-localnet': { // docker run -it -p8545:8545 -p8546:8546 ghcr.io/oasisprotocol/sapphire-localnet
      url: 'http://localhost:8545',
      chainId: 0x5afd,
      accounts,
    },
  },
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./contracts/'],
    },
    test: {
      tasks: ['test'],
      files: ['./contracts/', './test'],
    },
    coverage: {
      tasks: ['coverage'],
      files: ['./contracts/', './test'],
    },
  },
  mocha: {
    require: ['ts-node/register/files'],
    timeout: 50_000,
  },
};

export default config;
