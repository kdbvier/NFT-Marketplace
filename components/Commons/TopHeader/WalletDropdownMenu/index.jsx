import styles from './index.module.css';
import { logout } from 'redux/auth';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import metamaskIcon from 'assets/images/modal/metamask.png';
import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { NETWORKS } from 'config/networks';
import Image from 'next/image';
import { getAccountBalance } from 'util/MetaMask';

const WalletDropDownMenu = ({ handleWalletDropDownClose, networkId }) => {
  let router = useRouter();
  const dispatch = useDispatch();
  const { walletAddress, wallet: userWallet } = useSelector(
    (state) => state.auth
  );
  const loadingStatus = useSelector((state) => state.user.status);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showWallet, setShowWallet] = useState(false);

  const [wallet, setWallet] = useState(userWallet ? userWallet : '');
  const [balance, setBalance] = useState(0);
  const userLoadingStatus = useSelector((state) => state.user.status);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: handleWalletDropDownClose });

  function showHideUserPopup() {
    const userDropDown = document.getElementById('userDropDown');
    userDropDown.classList.toggle('hidden');
  }

  function showHideWallet() {
    setShowWallet(!showWallet);
  }

  function handleLogout() {
    dispatch(logout());
    // showHideUserPopup();
    router.push('/');
    window?.location.reload();
  }

  useEffect(() => {
    setWallet(userWallet ? userWallet : '');
    getBalance();
  }, [userLoadingStatus]);

  const getBalance = async () => {
    try {
      setIsLoadingBalance(true);
      if (walletAddress && walletAddress.length > 5) {
        const accountBalance = await getAccountBalance();
        setBalance(accountBalance);
        setIsLoadingBalance(false);
      }
    } catch {
      setIsLoadingBalance(false);
    }
  };

  return (
    <>
      <div
        ref={ref}
        className='h-auto md:h-auto md:border border-slate-300  bg-[#fff] rounded-xl absolute top-14 right-6 md:right-36 z-20'
      >
        <div className='pl-10 pr-3 py-3 border-b border-slate-300'>
          <h3 className='txtblack text-sm  mb-6 '>Wallet</h3>
          <p className='txtblack flex content-center mb-2'>
            <Image
              src={metamaskIcon}
              alt='mask'
              width={21}
              height={21}
              className='mr-2'
            />
            <span>Total Balance </span>
          </p>
          <h4 className='text-sm '>
            {NETWORKS[networkId] && (
              <div>{NETWORKS[networkId].networkName}</div>
            )}
          </h4>
          <h4 className='txtblack text-xl  mb-6 tracking-wide'>
            {isLoadingBalance && (
              <i className='fa fa-spinner fa-pulse fa-fw'></i>
            )}
            <span>
              {balance && Number(balance)?.toFixed(4)}{' '}
              {NETWORKS[networkId] ? NETWORKS[networkId].cryto : ''}
            </span>
          </h4>

          {/* <a className={styles.btnFund} href="#">
            <span>Add Funds</span>
          </a> */}
        </div>
        <div className='pl-10 pr-3 py-3'>
          <div
            onClick={handleLogout}
            className='items-center txtblack flex content-center font-base text-sm cursor-pointer'
          >
            <i className='fa-solid fa-right-from-bracket'></i>
            <span className='ml-2'>Log Out</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default WalletDropDownMenu;