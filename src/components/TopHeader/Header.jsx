import { useState, useEffect } from "react";
import Modal from "../Modal";
import Sidebar from "../Sidebar/Sidebar";
import logo from "assets/images/header/logo.svg";
import metamaskIcon from "assets/images/modal/metamask.png";
import torusIcon from "assets/images/modal/torus.png";
import notificationIcon from "assets/images/header/ico_notification@2x.png";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { loginUser, useAuthState, useAuthDispatch, logout } from "Context";
import {
  connectWallet,
  getPersonalSign,
  isWalletConnected,
} from "../../util/metaMaskWallet";
import { torusInit, torusWalletLogin, torusLogout } from "../../util/Torus";
import UserDropDownMenu from "./UserDropDownMenu";

const Header = () => {
  const { activateBrowserWallet, account, active, activate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [showModal, setShowModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [metamuskAccount, setMetamushAccount] = useState(account);
  const [torusAccountInfo, setTorusAccountInfo] = useState(null);
  const dispatch = useAuthDispatch();
  const context = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(context ? context.user : "");

  useEffect(() => {
    if (active) {
      if (account && account.length > 5) {
        setMetamushAccount(account);
      }
    }
  }, [account]);
  useEffect(() => {
    torusInit().then((e) => {
      setTorusAccountInfo(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConnectWallet() {
    const isConnected = await isWalletConnected();

    if (isConnected && metamuskAccount && metamuskAccount.length > 5) {
      getPersonalSign()
        .then((signature) => {
          userLogin(metamuskAccount, signature);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      try {
        await activate();
        activateBrowserWallet();
        await connectWallet();
      } catch (error) {
        if (!isConnected && !metamuskAccount) {
          window.location.reload();
        }
      }
      if (metamuskAccount && metamuskAccount.length > 5) {
        getPersonalSign()
          .then((signature) => {
            userLogin(metamuskAccount, signature);
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    }
  }
  async function loginTorus() {
    await torusWalletLogin().then((e) => {
      console.log("got response", e);
      setTorusAccountInfo(e);
      userLogin(e.address, e.signature);
    });
  }

  async function userLogin(address, signature) {
    const request = {
      address,
      signature,
    };
    try {
      setIsLoading(true);
      let response = await loginUser(dispatch, request);
      setUserId(response["user_id"]);
      setIsLoading(false);
      setShowModal(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }

  return (
    <div>
      <Sidebar show={showSideBar} handleClose={() => setShowSideBar(false)} />
      <nav
        className={`bg-white border border-gray-200 py-2 ${
          userId ? "sm:py-0" : ""
        } dark:bg-gray-800`}
      >
        <div className="flex flex-wrap justify-between items-center">
          <div
            onClick={() => setShowSideBar(true)}
            className="flex flex-wrap cp"
          >
            <button
              type="button"
              className="inline-flex items-center p-2 ml-3 mr-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="side-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="mx-auto">
              <img className="cp" src={logo} height="39" width="165" alt="" />
            </div>
          </div>
          <button
            data-collapse-toggle="mobile-menu"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() =>
              document.getElementById("mobile-menu").classList.toggle("hidden")
            }
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className="hidden w-full md:block md:w-auto mr-0 sm:mr-4"
            id="mobile-menu"
          >
            <ul className="flex items-center justify-center mt-4 pb-4 sm:pb-0 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <li>
                <button
                  onClick={torusLogout}
                  className="cp createProjectButtonConatiner"
                >
                  CREATE PROJECT
                </button>
              </li>
              <li className="md:!ml-2">
                {userId ? (
                  <div className="flex space-x-2">
                    <div className="relative w-16 h-16 pt-2">
                      <span className="cursor-pointer">
                        <img
                          src={notificationIcon}
                          width={42}
                          height={42}
                          alt="Notification icon"
                        />
                      </span>
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-2">
                        99+
                      </span>
                    </div>
                    <div className="relative w-16 h-16 pt-2 cursor-pointer">
                      <img
                        className="rounded-full border border-gray-100 shadow-sm"
                        src="/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
                        alt="user icon"
                        onClick={() => showHideUserPopup()}
                      />
                      {/* Dropdown menu */}
                      <div
                        id="userDropDown"
                        className="hidden z-10 w-72 bg-white text-base rounded divide-y divide-gray-100 shadow-xl dark:bg-gray-700 dark:divide-gray-600 float-right mt-4"
                      >
                        <UserDropDownMenu />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="cp walletLoginButtonConatiner"
                  >
                    WALLET LOGIN
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <div className={`walletContainer ${isLoading ? "loading" : ""}`}>
          <div className="walletTitle">WALLET</div>
          <div className="walletDescription">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
          <div className="flex-row sm:flex justify-center w-100 mt-4 px-4 walletLoginButtonModalContainer">
            <div
              className="metamaskButtonContainer cp my-4"
              onClick={handleConnectWallet}
            >
              <img
                className="metamaskIcon"
                src={metamaskIcon}
                alt="metamask wallet login button"
              />
              <div className="metamaskButtonLabel">
                {metamuskAccount ? (
                  <span>
                    <p>
                      Login with Address: {metamuskAccount.substring(0, 5)}
                      ...{" "}
                    </p>
                  </span>
                ) : (
                  <span>Connect MetaMask</span>
                )}
              </div>
            </div>
            <div className="torusButtonContainer cp my-4">
              <img
                className="torusIcon"
                src={torusIcon}
                alt="Touras wallet login button"
              />
              {torusAccountInfo == null ? (
                <div className="torusButtonLabel" onClick={loginTorus}>
                  Torus
                </div>
              ) : (
                <div className="torusButtonLabel">
                  Acccount : {torusAccountInfo.address.substring(0, 8)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Header;