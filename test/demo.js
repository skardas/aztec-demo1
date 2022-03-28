 const { ethers } = require("hardhat");

const utils = require('@aztec/dev-utils');
const aztec = require("aztec.js");
 const secp256k1 = require("@aztec/secp256k1");
const hre = require("hardhat");


const {
  proofs: { MINT_PROOF }
} = utils;
let ZkAssetMintable;

const { JoinSplitProof, MintProof } = aztec;

 function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }
// npx hardhat --network localhost faucet 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
describe("TestERC20", () =>{

  const bob = secp256k1.accountFromPrivateKey(
    "0xe543f6f1fbb48764732df41cf37cdebf2a9b3b025ff57aa690b1ca933c7d1c21"
  );
  const sally = secp256k1.accountFromPrivateKey(
    "0xf56ca604e8e455dfcaf2f152d75698a21d0660f1d9ee5cba5ec7c3f5eebd5a52"
  );
  let privatePaymentContract;
  var contract_address = "0xe299AEC4AA6a066b61A1C0FA02355EC2f8fCdb75";

  let runner;
  beforeEach(async () => {
      [owner] = await ethers.getSigners();
    runner = owner.address;
    console.log(runner)
    ZkAssetMintable = await  hre.ethers.getContractFactory("ZkAssetMintable");
    privatePaymentContract = await ZkAssetMintable.attach(contract_address);
   });

  it("Bob should be able to deposit 1000 then pay sally 250 by splitting notes he owns", async () => {
    console.log("Bob wants to deposit 1000");
    const bobNote1 = await aztec.note.create(bob.publicKey, 1000);

    const newMintCounterNote = await aztec.note.create(bob.publicKey, 1000);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const sender = runner;
    const mintedNotes = [bobNote1];

    const mintProof = new MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      sender
    );

    const mintData = mintProof.encodeABI();

    let tx = await privatePaymentContract.confidentialMint(MINT_PROOF, mintData, {
      from: runner,
      gasLimit: 25000000
    });

    console.log(tx.hash)
    await sleep(11000)

    console.log("completed mint proof");
    console.log("Bob successfully deposited 1000");

    // bob needs to pay sally for a taxi
    // the taxi is 25
    // if bob pays with his note worth 100 he requires 75 change
    console.log("Bob takes a taxi, Sally is the driver");
    const sallyTaxiFee = await aztec.note.create(sally.publicKey, 250);

    console.log("The fare comes to 250");
    const bobNote2 = await aztec.note.create(bob.publicKey, 750);
    const sendProofSender = runner;
    const withdrawPublicValue = 0;
    const publicOwner =runner;

    const sendProof = new JoinSplitProof(
      mintedNotes,
      [sallyTaxiFee, bobNote2],
      sendProofSender,
      withdrawPublicValue,
      publicOwner
    );
    const sendProofData = sendProof.encodeABI(privatePaymentContract.address);
    const sendProofSignatures = sendProof.constructSignatures(
      privatePaymentContract.address,
      [bob]
    );

    let tx2 =  await privatePaymentContract.functions["confidentialTransfer(bytes,bytes)"](
      sendProofData,
      sendProofSignatures,
      {
        from: runner,
        gasLimit: 25000000
      }
    );

    console.log("Bob paid sally 250 for the taxi and gets 75o back");

    console.log(tx2.hash)
  });
});
