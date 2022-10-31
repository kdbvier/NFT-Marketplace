import MetaMaskOnboarding from "@metamask/onboarding";

const currentUrl = new URL(window.location.href);
const forwarderOrigin = currentUrl.hostname === "localhost" ? "http://localhost:3000" : undefined;
let onboarding = new MetaMaskOnboarding({ forwarderOrigin });

export async function getWalletAccount() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      alert(error.message);
      return;
    }
  } else {
    onBoardBrowserPlugin();
    return;
  }
}

export async function isWalletConnected() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      const isConnected = await window.ethereum.isConnected();
      return isConnected;
    } catch (error) {
      console.error(error);
    }
  } else {
    onBoardBrowserPlugin();
    return false;
  }
}

/** Sign metamask to verify account */
export async function getPersonalSign() {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    let signedResult = "";
    try {
      signedResult = await window.ethereum.request({
        method: "personal_sign",
        params: [
          "You're signing to the decir.io",
          window.ethereum.selectedAddress,
        ],
      });
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        window.alert("Please connect to MetaMask.");
      } else {
        console.error(error.message);
      }
    }
    return signedResult;
  } else {
    onBoardBrowserPlugin();
    return;
  }
}

/** Tell user to install metamask if not installed */
function onBoardBrowserPlugin() {
  try {
    onboarding.startOnboarding();
  } catch (error) {
    console.error(error);
  }
  if (onboarding) {
    onboarding.stopOnboarding();
  }
}
