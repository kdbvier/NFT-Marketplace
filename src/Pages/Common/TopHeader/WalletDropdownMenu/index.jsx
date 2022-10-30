import "./index.css";
import { useAuthState, useAuthDispatch, logout } from "redux/auth";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import metamaskIcon from "assets/images/modal/metamask.png";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { NETWORKS } from "config/networks";

const WalletDropDownMenu = ({ handleWalletDropDownClose, networkId }) => {
  let history = useHistory();
  const dispatch = useAuthDispatch();
  const loadingStatus = useSelector((state) => state.user.status);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWallet, setShowWallet] = useState(false);
  const context = useAuthState();
  const [selectedWallet, setSelectedWallet] = useState(
    context ? context.walletAddress : ""
  );
  const [wallet, setWallet] = useState(context ? context.wallet : "");
  const [balance, setBalance] = useState(0);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: handleWalletDropDownClose });

  function showHideUserPopup() {
    const userDropDown = document.getElementById("userDropDown");
    userDropDown.classList.toggle("hidden");
  }

  function showHideWallet() {
    setShowWallet(!showWallet);
  }

  function handleLogout() {
    logout(dispatch);
    // showHideUserPopup();
    history.push("/");
    window.location.reload();
  }

  useEffect(() => {
    setWallet(context ? context.wallet : "");
    try {
      setIsLoadingBalance(true);
      // const web3 = new Web3(new Web3.providers.HttpProvider(Config.RPC_URL));
      const web3 = new Web3(window?.ethereum);
      if (selectedWallet && selectedWallet.length > 5) {
        web3.eth.getBalance(selectedWallet).then((res) => {
          setBalance(res / 10 ** 18);
          setIsLoadingBalance(false);
        });
      }
    } catch {
      setIsLoadingBalance(false);
    }
  }, [userLoadingStatus]);

  return (
    <>
      <div
        ref={ref}
        className="h-auto md:h-auto md:border border-slate-300  bg-[#fff] rounded-xl absolute top-14 right-6 md:right-36 z-20"
      >
        <div className="pl-10 pr-3 py-3 border-b border-slate-300">
          <h3 className="txtblack text-sm  mb-6 ">Wallet</h3>
          <p className="txtblack flex content-center mb-2">
            <img
              src={metamaskIcon}
              alt="mask"
              width={21}
              height={21}
              className="mr-2"
            />
            <span>Total Balance </span>
          </p>
          <h4 className="text-sm ">
            {NETWORKS[networkId] && (
              <div>{NETWORKS[networkId].networkName}</div>
            )}
          </h4>
          <h4 className="txtblack text-xl  mb-6 tracking-wide">
            {isLoadingBalance && (
              <i className="fa fa-spinner fa-pulse fa-fw"></i>
            )}
            <span>
              {balance ? balance.toFixed(4) : 0}{" "}
              {NETWORKS[networkId] ? NETWORKS[networkId].cryto : ""}
            </span>
          </h4>

          <a className="btn-fund" href="#">
            <span>Add Funds</span>
          </a>
        </div>

        {/* Switch wallet */}
        {/* <div className="pl-10 pr-3 py-3 border-b border-slate-300">
          <div
            onClick={handleLogout}
            className="items-center txtblack flex content-center font-base text-sm cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
            <span className="ml-2">Switch Wallet</span>
          </div>
        </div> */}
        <div className="pl-10 pr-3 py-3">
          <div
            onClick={handleLogout}
            className="items-center txtblack flex content-center font-base text-sm cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="ml-2">Log Out</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default WalletDropDownMenu;