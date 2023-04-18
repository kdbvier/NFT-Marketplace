import { ethers } from 'ethers';
import { createInstance } from 'config/ABI/forwarder';
import { signMetaTxRequest } from 'util/smartcontract/signer';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';
import { address } from 'config/contractAddresses';

async function sendMetaTx(
  collection,
  provider,
  signer,
  config,
  type,
  productPrice
) {
  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  let chainId = ls_GetChainID();
  let minimalForwarder = NETWORKS[chainId]?.forwarder;
  let masterCopyCollection = NETWORKS[chainId]?.masterCopyCollection;
  let masterMembershipCollection =
    NETWORKS[Number(chainId)]?.masterMembershipCollection;
  let discount = NETWORKS[Number(chainId)]?.discount;
  let treasury = NETWORKS[Number(chainId)]?.decirTreasury;

  let webhook = NETWORKS[Number(chainId)]?.webhook;

  const args = {
    isCollection: true,
    collection: {
      deployConfig: {
        name: config?.deploymentConfig?.name,
        symbol: config?.deploymentConfig?.symbol,
        owner: from,
        masterCopy:
          type === 'membership'
            ? masterMembershipCollection
            : masterCopyCollection,
      },
      runConfig: {
        baseURI: config?.runtimeConfig?.baseURI,
        royaltiesBps: config?.runtimeConfig?.royaltiesBps,
        royaltyAddress: config?.runtimeConfig?.royaltiesAddress,
        maxSupply: type === 'product' ? config?.runtimeConfig?.totalSupply : 0,
        floorPrice: ethers.utils.parseUnits(
          type === 'product' ? productPrice.toString() : '0',
          'ether'
        ),
      },
    },
    decirTreasury: treasury,
    discount: discount,
    forwarder: minimalForwarder,
  };

  const data = collection.interface.encodeFunctionData(
    type === 'membership' ? 'createMembershipProxy' : 'createCollectionProxy',
    [args]
  );
  const to = collection.address;

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

export async function createCollection(
  collection,
  provider,
  config,
  type,
  productPrice,
  wagmiSigner
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
  } else if (walletType === 'walletconnect') {
    signer = wagmiSigner;
  }

  let output;
  const result = await sendMetaTx(
    collection,
    provider,
    signer,
    config,
    type,
    productPrice
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

export async function createCollectionByCaller(
  collection,
  config,
  type,
  productPrice,
  wagmiSigner
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
  } else if (walletType === 'walletconnect') {
    signer = wagmiSigner;
  }
  const from = await signer.getAddress();
  console.log('singer: ', from);
  let chainId = ls_GetChainID();
  let minimalForwarder = NETWORKS[chainId]?.forwarder;
  let masterCopyCollection = NETWORKS[chainId]?.masterCopyCollection;
  let masterMembershipCollection =
    NETWORKS[Number(chainId)]?.masterMembershipCollection;
  let discount = NETWORKS[Number(chainId)]?.discount;
  let treasury = NETWORKS[Number(chainId)]?.decirTreasury;

  const args = {
    isCollection: true,
    collection: {
      deployConfig: {
        name: config?.deploymentConfig?.name,
        symbol: config?.deploymentConfig?.symbol,
        owner: from,
        masterCopy:
          type === 'membership'
            ? masterMembershipCollection
            : masterCopyCollection,
      },
      runConfig: {
        baseURI: config?.runtimeConfig?.baseURI,
        royaltiesBps: config?.runtimeConfig?.royaltiesBps,
        royaltyAddress: config?.runtimeConfig?.royaltiesAddress,
        maxSupply: type === 'product' ? config?.runtimeConfig?.totalSupply : 0,
        floorPrice: ethers.utils.parseUnits(
          type === 'product' ? productPrice.toString() : '0',
          'ether'
        ),
      },
    },
    decirTreasury: treasury,
    discount: discount,
    forwarder: minimalForwarder,
  };
  console.log('by caller: ', args);
  let response;
  if (type === 'membership') {
    const tx = await collection.connect(signer).createMembershipProxy(args);
    response = await tx.wait();
  } else {
    const tx = await collection.connect(signer).createCollectionProxy(args);
    response = await tx.wait();
  }
  console.log('Res: ', response);
  return {
    txReceipt: {
      blockNumber: response.blockNumber,
      transactionHash: response.transactionHash,
    },
  };
}
