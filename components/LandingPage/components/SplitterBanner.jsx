import Image from 'next/image';
import React, { useState } from 'react';
import wave from 'assets/images/profile/multipleWeb.svg';
import lockLayer from 'assets/images/profile/lockLayer.svg';
import Modal from 'components/Commons/Modal';
import CreateSplitter from 'components/Profile/components/CreateSplitter';
import step1 from 'assets/images/profile/splitter/step1.png';
import step2 from 'assets/images/profile/splitter/step2.png';
import step3 from 'assets/images/profile/splitter/step3.png';
import step4 from 'assets/images/profile/splitter/step4.png';
export default function SplitterBanner() {
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [createSplitterModal, showCreateSplitterModal] = useState(false);

  const handelOnClick = async () => {
    setShowHelperModal(true);
  };
  const onCreateSplitter = () => {
    setShowHelperModal(false);
    showCreateSplitterModal(true);
  };
  return (
    <div>
      <p className='textSubtle-100 text-[20px] font-black my-4'>
        Royalty Splitter
      </p>
      <div className='rounded-2xl bg-white drop-shadow-xl px-6 pt-5 pb-4 md:pb-0 border border-secondary-900'>
        <div className='grid grid-cols-1 md:grid-cols-2 relative'>
          <div className='break-all'>
            {' '}
            <p className='gradient-text-deep-pueple font-black text-[24px] md:text-[28px] mt-5 break-word'>
              Create Royalty Splitter
            </p>
            <p className='mb-6 text-[14px] break-word'>
              Create Once and in use any collection
            </p>
            <div className='flex flex-wrap items-center gap-4'>
              <button
                onClick={() => handelOnClick()}
                className='gradient-text-deep-pueple font-black border w-[160px] text-center h-[40px] rounded-lg border-secondary-900'
              >
                Get started
              </button>
              <a
                href='https://decir.gitbook.io/whitepaper/royalty-splitter'
                target='_blank'
                className='!no-underline text-black font-black text-[14px] cursor-pointer'
                rel='noreferrer'
              >
                How it works{' '}
                <i className='ml-2 fa-sharp fa-solid fa-arrow-right text-textSubtle-200 font-medium'></i>
              </a>
            </div>
          </div>
          <div className='hidden md:block'>
            <Image
              alt=''
              src={wave}
              height={180}
              width={200}
              className='h-[180px] w-full'
            ></Image>
            <Image
              alt=''
              src={lockLayer}
              height={157}
              width={200}
              className='w-[161px] h-[157px] absolute right-0 top-3'
            ></Image>
          </div>
        </div>
      </div>
      {showHelperModal && (
        <Modal
          show={showHelperModal}
          handleClose={() => setShowHelperModal(false)}
          width={600}
          height={800}
          overflow={'auto'}
        >
          <div className='p-4 mt-5 md:mt-0 !leading-relaxed !break-words'>
            <p className='text-txtblack font-black text-[24px] mb-4'>
              The royalty splitter quick guide
            </p>
            <p className='text-[20px] font-semibold text-txtblack'>
              What is the royalty splitter?
            </p>
            <ul className='list-disc text-textSubtle ml-4 mt-4 '>
              <li>
                The royalty splitter is the smart contract that the project
                owner is able to share the "creator royalty" with your team
                members from the secondary marketplaces.
              </li>
              <li>Currently, we are only supporting Opensea and Rarible.</li>
              <li>
                {' '}
                This is the royalty splitter setting page for the NFT collection
                which already exists.(if you are going to create the NFT
                Collection ahead, please go to “Create collection”.)
              </li>
            </ul>
            <div className='text-[20px] font-semibold mt-4 text-txtblack !break-words'>
              Step 1: Press “Create New” and type the royalty splitter name.
            </div>
            <Image
              src={step1}
              height={246}
              width={483}
              className='rounded object-cover mt-4 w-full '
              alt='step 1'
            ></Image>
            <div className='text-[20px] font-semibold mt-8 text-txtblack !break-words'>
              Step 2: Press “Add More” and input the contributor’s wallet
              address and share percentage.
            </div>
            <Image
              src={step2}
              height={300}
              width={483}
              className='rounded object-cover mt-4 w-full '
              alt='step 2 '
            ></Image>

            <div className='text-[20px] font-semibold mt-8 text-txtblack !break-words'>
              Step 3: Press “Lock Percentage” to lock the royalty splitter and
              publish.
            </div>
            <Image
              src={step3}
              height={300}
              width={483}
              className='rounded object-cover mt-4 w-full '
              alt='step 3'
            ></Image>

            <div className='mt-8 text-txtblack !break-words'>
              Please refer to the commission, conditions, and terms before
              proceeding.
            </div>
            <div className=' text-txtblack !break-words'>
              Once the royalty splitter has been published. You can not change
              the setting again.
            </div>
            <Image
              src={step4}
              height={300}
              width={483}
              className='rounded object-cover mt-4 w-full '
              alt='step 4'
            ></Image>

            <div className='mt-10 text-right'>
              <button
                onClick={() => onCreateSplitter()}
                className='btn bg-primary-50 text-primary-900 btn-sm mr-4 w-[120px]'
              >
                Start
              </button>
            </div>
          </div>
        </Modal>
      )}

      {createSplitterModal && (
        <CreateSplitter
          show={createSplitterModal}
          handleClose={() => showCreateSplitterModal(false)}
        />
      )}
    </div>
  );
}
