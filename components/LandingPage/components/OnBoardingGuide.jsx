import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Gas from 'assets/images/header/gas.svg';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function OnBoardingGuide() {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [open, setOPen] = useState(true);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [showCreateNFTModal, setShowCreateNFTModal] = useState(false);

  const redirectToDiscord = () => {
    if (typeof window !== 'undefined') {
      window.open('https://discord.com/invite/ST2tNtPvGY', '_blank').focus();
    }
  };

  const redirectToNftCreatePage = () => {
    if (userinfo?.id) {
      setShowCreateNFTModal(true);
    } else {
      setShowWalletConnectModal(true);
    }
  };

  return (
    <>
      <div className='bg-gradient-to-b from-color-gray-dark to-color-gray-light rounded-b-2xl z-10 relative'>
        <div className=' overflow-x-auto md:max-w-[1239px] mx-auto px-6 '>
          <div className='flex flex-wrap items-center justify-center gap-4 text-black my-4'>
            <p className='break-normal  text-center text-[14px] '>
              👋🏻 <span className='font-black'>Welcome to DeCir</span>, Let’s get
              started with some guidance!
            </p>
            <button
              onClick={() => setOPen((pre) => !pre)}
              className='unset-all bg-transparent font-black'
            >
              {open ? 'Hide' : 'Expand'}{' '}
              <span>
                {open ? (
                  <i className='fa-solid fa-chevrons-up'></i>
                ) : (
                  <i className='fa-solid fa-chevrons-down'></i>
                )}
              </span>
            </button>
          </div>
          {open && (
            <div className='flex my-5 pb-3 gap-x-4 overflow-x-auto whitespace-nowrap'>
              <div className='min-w-[434px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4'>
                  <div>
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Create Your NFT
                    </div>
                    <p className='text-textSubtle-100 text-[14px]'>
                      Few step to create NFT without coding
                    </p>
                  </div>
                  <div
                    className='ml-auto text-black font-black text-[14px] cursor-pointer'
                    onClick={() => redirectToNftCreatePage()}
                  >
                    Get started{' '}
                    <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                  </div>
                </div>
              </div>
              <div className='min-w-[407px]  rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4'>
                  <div>
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Guide tour
                    </div>
                    <p className='text-textSubtle-100 text-[14px]'>
                      Walk you thought the core function
                    </p>
                  </div>
                  <Link
                    className='ml-auto text-black font-black text-[14px] cursor-pointer'
                    href='https://decir.gitbook.io/decir/'
                    passHref
                    target='_blank'
                  >
                    Get started{' '}
                    <i className=' ml-2 fa-sharp fa-solid fa-arrow-right'></i>
                  </Link>
                </div>
              </div>
              <div className='min-w-[302px] rounded-[8px] bg-gradient-to-r from-white to-secondary-200/[0.8]'>
                <div className='triangle'></div>
                <div className='flex items-center px-6 pb-3 -mt-4'>
                  <div
                    className='cursor-pointer'
                    onClick={() => redirectToDiscord()}
                  >
                    <div className='gradient-text-deep-pueple font-black text-[18px]'>
                      Need help?
                    </div>
                    <p className='text-textSubtle-100 text-[14px]'>
                      Ask anything you need to support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='content-valuation flex items-center justify-center pt-6 pb-2 -mt-4 flex-wrap'>
        <div className='flex items-center'>
          <Image src={Gas} alt='Gas' />
          <p className='font-black text-[12px] ml-1'>GAS</p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Standard</span> 19 GWei - $0.65 | 1
            Minute
          </p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Slow</span> 19 GWei - $0.65 | 1 Minute
          </p>
        </div>
        <div className='mx-6'>
          <p className=' text-[12px]'>
            <span className='font-black'>Fast</span> 19 GWei - $0.65 | 1 Minute
          </p>
        </div>
        <div>
          <p className=' text-[12px]'>
            <span className='font-black'>Rapid</span> 19 GWei - $0.65 | 1 Minute
          </p>
        </div>
      </div>
      <WalletConnectModal
        showModal={showWalletConnectModal}
        closeModal={() => setShowWalletConnectModal(false)}
        noRedirection={false}
        navigateToPage={'/dashboard?createNFT=true'}
      />

      {showCreateNFTModal && (
        <CreateNFTModal
          show={showCreateNFTModal}
          handleClose={() => {
            setShowCreateNFTModal(false);
            setNeedToShowAfterLogin(false);
          }}
        />
      )}
    </>
  );
}
