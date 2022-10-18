import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { createDAOInstance } from "./dao-contract";
import { addressGnosisSetup } from "services/project/projectService";
import address from "../deploy.json";

// import { createInstance } from "eth/registry";

// async function sendTx(dao, name) {
//   console.log(`Sending register tx to set name=${name}`);

//   // add gnosis safe wallet creation logic here
//   // const safeInfo = await createSafe(from);
//   // console.log(`Safe will be created with ${safeInfo}`);

//   return dao.cloneContract(name);
// }

async function sendMetaTx(
  dao,
  provider,
  signer,
  name,
  treasuryAddress,
  chainId
) {
  console.log(`Sending register meta-tx to set name=${name}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let formData = new FormData();
  formData.append("addresses", from);
  formData.append("blockchain", chainId);
  const setupData = await addressGnosisSetup(formData);
  let args = {
    masterCopy: address.CreatorDAOMasterCopy,
    forwarder: address.MinimalForwarder,
    name,
    safeFactory: process.env.REACT_APP_SAFE_PROXY_ADDRESS,
    singleton: process.env.REACT_APP_SAFE_SINGLETON_ADDRESS,
    setupData: `0x${setupData.call_data}`,
    nonce: new Date().getTime(),
    hasTreasury: treasuryAddress ? true : false,
    safeProxy: treasuryAddress ? treasuryAddress : ethers.constants.AddressZero,
    creator: from,
  };
  const data = dao.interface.encodeFunctionData("createProxyContract", [args]);
  const to = dao.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function createDAO(dao, provider, name, treasuryAddress, chainId) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();

  let output;
  const result = await sendMetaTx(
    dao,
    provider,
    signer,
    name,
    treasuryAddress,
    chainId
  );

  await result.json().then(async (response) => {
    const tx = JSON.parse(response.result);
    const txReceipt = await provider.waitForTransaction(tx.txHash);
    output = { txReceipt };
  });

  return output;
}
