import { ethers } from 'ethers';
import { ls_GetWalletType } from 'util/ApplicationStorage';
import { etherMagicProvider } from 'config/magicWallet/magic';

export async function createMembershipMintNFT(
  mintContract,
  url,
  tier,
  provider,
  value
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
  const contract = mintContract.connect(signer);
  try {
    const from = await signer.getAddress();
    const result = await contract.mintToCaller(from, url, tier, {
      value: ethers.utils.parseEther(value.toString()),
    });
    console.log(result);
    const txReceipt = await provider.waitForTransaction(result.hash);
    return txReceipt;
  } catch (err) {
    throw new Error(err);
  }
}
