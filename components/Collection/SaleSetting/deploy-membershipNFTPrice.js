import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

async function sendMetaTx(contract, provider, signer, tier) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = contract.interface.encodeFunctionData('setTiers', [tier]);
  const to = contract.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });
  let chainId = ls_GetChainID();
  let webhook = NETWORKS?.[chainId]?.webhook;
  return fetch(webhook, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function setMemNFTPrice(collection, provider, tier) {
  let walletType = await ls_GetWalletType();
  let signer;
  if (walletType === 'metamask') {
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = userProvider.getSigner();
  } else if (walletType === 'magicwallet') {
    signer = etherMagicProvider.getSigner();
  }
  let output;
  const result = await sendMetaTx(collection, provider, signer, tier);

  await result.json().then(async (response) => {
    if (response.status === 'success') {
      const tx = JSON.parse(response.result);
      const txReceipt = await provider.waitForTransaction(tx.txHash);
      output = { txReceipt };
    } else {
      output = response.message;
    }
  });

  return output;
}

export async function setMemNFTPriceByCaller(collection, provider, tier) {
  let walletType = await ls_GetWalletType();
  let signer;
  if (walletType === 'metamask') {
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = userProvider.getSigner();
  } else if (walletType === 'magicwallet') {
    signer = etherMagicProvider.getSigner();
  }
  const tx = await collection.connect(signer).setTiers(tier);
  const res = await tx.wait();
  return {
    txReceipt: res,
  };
}
