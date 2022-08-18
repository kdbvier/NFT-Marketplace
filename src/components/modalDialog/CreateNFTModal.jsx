import Modal from '../Modal';
import Users from 'assets/images/createDAO/users.svg';
import HandShake from 'assets/images/createDAO/handshake.svg';
import Product from 'assets/images/createDAO/product.svg';
import Tooltip from 'components/Tooltip';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CreateRightAttachedNFT from 'components/modalDialog/CreateRightAttachNFT';

const CreateNFTModal = ({ handleClose, show }) => {
  const [ShowCreateRANFT, setShowCreateRANFT] = useState(false);
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      style={{ backgroundColor: '#fff' }}
    >
      <CreateRightAttachedNFT
        show={ShowCreateRANFT}
        handleClose={() => setShowCreateRANFT(false)}
      />
      <div>
        <h3 className='text-[28px] text-black font-black mb-8'>
          Create new NFT
        </h3>
        <div className='cursor-pointer flex bg-[#FBF9FF] border-[1px] border-[#C7CEE6] rounded-[12px] p-6 mb-6'>
          <div className='mr-6 h-[74px] w-[74px] bg-[#FFA800] bg-opacity-[0.5] flex items-center justify-center rounded-[8px]'>
            <img src={Users} alt='Users' />
          </div>
          <div>
            <h3 className='text-[24px] font-bold text-[#303548]'>
              Membership NFT
            </h3>
            <p className='text-[14px] text-[#5F6479] w-[470px] mt-2'>
              Get fundraise by creating NFT Membership and make your own
              Decentralize Community
            </p>
          </div>
        </div>
        <div className='cursor-pointer flex bg-[#FBF9FF] border-[1px] border-[#C7CEE6] rounded-[12px] p-6 mb-6'>
          <div className='mr-6 h-[74px] w-[74px] bg-[#9A5AFF] bg-opacity-[0.5] flex items-center justify-center rounded-[8px]'>
            <img src={Product} alt='Product' />
          </div>
          <div>
            <h3 className='text-[24px] font-bold text-[#303548]'>
              Product NFT
            </h3>
            <p className='text-[14px] text-[#5F6479] w-[470px] mt-2'>
              Start Creating your NFT and earn as a Creator
            </p>
          </div>
        </div>
        <div
          className='cursor-pointer flex bg-[#FBF9FF] border-[1px] border-[#C7CEE6] rounded-[12px] p-6 mb-6'
          onClick={() => setShowCreateRANFT(true)}
        >
          <div className='mr-6 h-[74px] w-[74px] bg-[#32E865] bg-opacity-[0.5] flex items-center justify-center rounded-[8px]'>
            <img src={HandShake} alt='HandShake' />
          </div>
          <div>
            <h3 className='text-[24px] font-bold text-[#303548]'>
              Rights Attached NFT
            </h3>
            <p className='text-[14px] text-[#5F6479] w-[470px] mt-2'>
              Have a team? Dont worry! we’re gonna split the royalties so
              everyone get more clran Revenue!
            </p>
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <Tooltip message='Click to create a collection' />
          <Link to='/collection-create'>
            <button className='rounded-[12px] py-3 px-4 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[14px] font-black'>
              Create Collection
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNFTModal;
