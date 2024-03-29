import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { addressGnosisSetup } from 'services/project/projectService';
import { NETWORKS } from 'config/networks';
import { address } from 'config/contractAddresses';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

async function sendMetaTx(
  dao,
  provider,
  signer,
  name,
  treasuryAddress,
  chainId
) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let formData = new FormData();
  formData.append('addresses', from);
  formData.append('blockchain', chainId);
  const setupData = await addressGnosisSetup(formData);
  let minimalForwarder = NETWORKS?.[Number(chainId)]?.forwarder;
  let masterCopy = NETWORKS?.[Number(chainId)]?.masterCopyDAO;
  let webhook = NETWORKS?.[Number(chainId)]?.webhook;
  let config = {
    isDAO: true,
    dao: {
      masterCopy: masterCopy,
      safeFactory: address.SafeProxyAddress,
      singleton: address.SafeSingletonAddress,
      setupData: `0x${setupData.call_data}`,
      nonce: new Date().getTime(),
      hasTreasury: treasuryAddress ? true : false,
      safeProxy: treasuryAddress
        ? treasuryAddress
        : ethers.constants.AddressZero,
      creator: from,
    },
    forwarder: minimalForwarder,
  };

  const data = dao.interface.encodeFunctionData('createDAOProxy', [config]);
  const to = dao.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(webhook, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function createDAO(dao, provider, name, treasuryAddress, chainId) {
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
  const result = await sendMetaTx(
    dao,
    provider,
    signer,
    name,
    treasuryAddress,
    chainId
  );

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

export async function createDAOByCaller(
  dao,
  provider,
  name,
  treasuryAddress,
  chainId
) {
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

  const from = await signer.getAddress();
  let formData = new FormData();
  formData.append('addresses', from);
  formData.append('blockchain', chainId);
  const setupData = await addressGnosisSetup(formData);
  let minimalForwarder = NETWORKS?.[Number(chainId)]?.forwarder;
  let masterCopy = NETWORKS?.[Number(chainId)]?.masterCopyDAO;
  let config = {
    isDAO: true,
    dao: {
      masterCopy: masterCopy,
      safeFactory: address.SafeProxyAddress,
      singleton: address.SafeSingletonAddress,
      setupData: `0x${setupData.call_data}`,
      nonce: new Date().getTime(),
      hasTreasury: treasuryAddress ? true : false,
      safeProxy: treasuryAddress
        ? treasuryAddress
        : ethers.constants.AddressZero,
      creator: from,
    },
    forwarder: minimalForwarder,
  };

  const tx = await dao.connect(signer).createDAOProxy(config);
  const res = await tx.wait();

  return { txReceipt: res };
}
