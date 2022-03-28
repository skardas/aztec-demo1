const hre = require("hardhat");
const utils = require('@aztec/dev-utils');
const bn128 = require('@aztec/bn128');

const {
    proofs: {
        JOIN_SPLIT_PROOF,
        MINT_PROOF,
        SWAP_PROOF,
        DIVIDEND_PROOF,
        PRIVATE_RANGE_PROOF,
    },
} = utils;
const { isUndefined } = require('lodash');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Migrations = await hre.ethers.getContractFactory("Migrations");
    const migrations = await Migrations.deploy();
    console.log("Migrations address:", migrations.address);

    const ACE =await  hre.ethers.getContractFactory("ACE");
    const JoinSplitFluid =await  hre.ethers.getContractFactory("JoinSplitFluid");
    const Swap =await  hre.ethers.getContractFactory("Swap");
    const Dividend = await hre.ethers.getContractFactory('Dividend');
    const PrivateRange =await  hre.ethers.getContractFactory("PrivateRange");
    const JoinSplit =await  hre.ethers.getContractFactory("JoinSplit");

    const BaseFactory = await  hre.ethers.getContractFactory("FactoryBase201907");
    const AdjustableFactory = await  hre.ethers.getContractFactory("FactoryAdjustable201907");

    const ZkAsset = await  hre.ethers.getContractFactory("ZkAsset");
    const ZkAssetMintable = await  hre.ethers.getContractFactory("ZkAssetMintable");
    const TestERC20 = await  hre.ethers.getContractFactory("TestERC20");

    const ace = await ACE.deploy();
    console.log("ACE address:", ace.address);

    const joinSplitFluid = await JoinSplitFluid.deploy();
    console.log("JoinSplitFluid address:", joinSplitFluid.address);

    const swap = await Swap.deploy();
    console.log("Swap address:", swap.address);

    const joinSplit = await JoinSplit.deploy();
    console.log("JoinSplit address:", joinSplit.address);

    const privateRange = await PrivateRange.deploy();
    console.log("PrivateRange address:", privateRange.address);

    const dividend = await Dividend.deploy();
    console.log("Dividend address:", dividend.address);
    console.log("wait for one mine block")
    await sleep(6 * 1000);

    const ACEContract = ace;// await ACE.deployed(bn128.CRS);
  //  const JoinSplitFluidContract = await JoinSplitFluid.deployed();
     await ACEContract.setCommonReferenceString(bn128.CRS);
     await ACEContract.setProof(MINT_PROOF, joinSplitFluid.address);
    await ACEContract.setProof(SWAP_PROOF, swap.address);
    await ACEContract.setProof(DIVIDEND_PROOF, dividend.address);
    await ACEContract.setProof(JOIN_SPLIT_PROOF, joinSplit.address);
    await ACEContract.setProof(PRIVATE_RANGE_PROOF, privateRange.address);
    console.log("wait for one mine block")
    await sleep(6 * 1000);
     await BaseFactory.deploy(ace.address).then(async ({ address }) => {
           await ace.setFactory(1 * 256 ** 2 + 1 * 256 ** 1 + 1 * 256 ** 0, address);

     });
    console.log("wait for one mine block")
    await sleep(6 * 1000);
    await AdjustableFactory.deploy(ace.address).then(async ({ address }) => {
         await ace.setFactory(1 * 256 ** 2 + 1 * 256 ** 1 + 2 * 256 ** 0, address);

    });
    console.log("wait for one mine block")
    await sleep(6 * 1000);

    const testERC20 = await TestERC20.deploy();
    console.log("TestERC20 address:", testERC20.address);
    console.log("wait for one mine block")
    await sleep(6 * 1000);
    await ZkAsset.deploy( ace.address, testERC20.address, 1,{
        gasLimit: 25000000
    });
    console.log("wait for one mine block")
    await sleep(6 * 1000);

    // initialise the private asset
    tx = await ZkAssetMintable.deploy(
        ace.address,
        '0x0000000000000000000000000000000000000000',
        1,
        0,
        [],
        {
            gasLimit: 25000000
        }
    );
    console.log(tx.blockNumber)

    console.log(tx.address)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
