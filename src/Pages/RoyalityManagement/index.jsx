import { useState, useEffect } from 'react';
import DropdownCreabo from 'components/DropdownCreabo';
import CirclePlus from 'assets/images/icons/plus-circle.svg';
import MemberListTable from 'components/RoyalityManagement/MemberListTable/MemberListTable';
import styles from './style.module.css';
import FB from 'assets/images/icons/fb.svg';
import twitter from 'assets/images/icons/twitter.svg';
import reddit from 'assets/images/icons/reddit.svg';
import instagram from 'assets/images/icons/instagram.svg';
import NFTSample from 'assets/images/createDAO/nft-sample.svg';
import NewPublishModal from 'components/modalDialog/NewPublishModal';
import { useParams } from 'react-router-dom';
import {
  getCollectionNFTs,
  getCollections,
  getCollectionDetailsById,
  connectCollection,
} from 'services/collection/collectionService';
import { getRightAttachedNFT, updateRoyalty } from 'services/nft/nftService';
import ColImage from 'assets/images/collection-wrapper.svg';
import { Link } from 'react-router-dom';
import ConfirmationModal from 'components/modalDialog/ConfirmationModal';
import SuccessModal from 'components/modalDialog/SuccessModal';

const TABLE_HEADERS = [
  { id: 0, label: 'Wallet Address' },
  { id: 1, label: 'Name' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Percentage' },
  { id: 4, label: 'Token ID' },
  { id: 5, label: 'Role' },
  // { id: 6, label: 'Action' },
];

const RoyalityManagement = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [data, setData] = useState();
  const [IsLoading, setIsLoading] = useState(false);
  const [Collections, setCollections] = useState([]);
  const [CollectionDetail, setCollectionDetail] = useState([]);
  const [IsConnectionLoading, setIsConnectionLoading] = useState(false);
  const [IsNFTAvailable, setIsNFTAvailable] = useState(false);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [ConnectedSuccessfully, setConnectedSuccessfully] = useState(false);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [ShowPercentError, setShowPercentError] = useState(false);

  const { collectionId } = useParams();
  let origin = window.location.origin;

  useEffect(() => {
    setIsLoading(true);
    getCollectionNFTs(collectionId)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          if (resp?.lnfts?.[0]) {
            console.log(resp);
            setIsNFTAvailable(true);
            let ranftId = resp?.lnfts?.[0];
            handleGetNftDetail(ranftId.id);
          } else {
            setIsNFTAvailable(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    getCollectionDetail();

    return () => {
      setShowPercentError(false);
    };
  }, []);

  const handleAutoAssign = (e) => {
    setAutoAssign(!AutoAssign);
    let memberCount = data.members.length;
    let value = 100 / memberCount;
    let values = {
      ...data,
      members: data.members.map((mem) => {
        return {
          ...mem,
          royalty_percent: value,
        };
      }),
    };
    setData(values);
  };

  const handleChange = (e) => {
    setSelectedCollectionId(e.target.value);
  };

  const getAllCollections = (id) => {
    getCollections('project', id)
      .then((resp) => {
        if (resp.code === 0) {
          let items = resp?.data.filter((col) => col.type !== 'right_attach');
          setCollections(items);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCollectionDetail = () => {
    const payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => setCollectionDetail(resp.collection))
      .catch((err) => console.log(err));
  };

  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-share-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }

  const handleConnectCollection = () => {
    setIsConnectionLoading(true);
    connectCollection(data.lnft.id, selectedCollectionId)
      .then((resp) => {
        setIsConnectionLoading(false);
        if (resp.code === 0) {
          setConnectedSuccessfully(true);
          setTimeout(() => {
            setConnectedSuccessfully(false);
          }, [2500]);
        }
        console.log(resp);
      })
      .catch((err) => console.log(err));
  };

  const handleGetNftDetail = (id) => {
    getRightAttachedNFT(id)
      .then((resp) => {
        if (resp.code === 0) {
          setData(resp);
          getAllCollections(resp?.project_id);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAutoFill = () => {
    let members = data.members.map((mem) => {
      return {
        user_id: mem.id,
        royalty: mem.royalty_percent,
      };
    });
    let formData = new FormData();
    formData.append('royalties', JSON.stringify(members));
    if (!ShowPercentError) {
      setIsAutoFillLoading(true);
      updateRoyalty(data?.lnft?.id, formData)
        .then((resp) => {
          if (resp.code === 0) {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(true);
            setAutoAssign(false);
            setIsEdit(null);
          } else {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsAutoFillLoading(false);
          setRoyaltyUpdatedSuccessfully(false);
        });
    }
  };

  const handleValueChange = (e, id) => {
    let values = {
      ...data,
      members: data.members.map((mem) => {
        if (id === mem.id) {
          return {
            ...mem,
            royalty_percent: parseInt(e.target.value),
          };
        }
        return mem;
      }),
    };

    let percent = values.members.reduce(
      (acc, val) => acc + val.royalty_percent,
      0
    );

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setData(values);
  };

  return (
    <div
      className={`mt-3 ${
        IsLoading || IsConnectionLoading || IsAutoFillLoading ? 'loading' : ''
      }`}
    >
      <NewPublishModal
        show={showPublish}
        handleClose={() => setShowPublish(false)}
      />
      <ConfirmationModal
        show={AutoAssign}
        handleClose={setAutoAssign}
        handleApply={handleAutoFill}
      />
      <SuccessModal
        show={RoyaltyUpdatedSuccessfully}
        handleClose={setRoyaltyUpdatedSuccessfully}
        message='Royalty Percentage Updated Successfully'
        btnText='Done'
      />
      <div
        className={`${styles.memberSection} bg-white rounded-[12px] p-6 flex`}
      >
        <img
          src={ColImage}
          className='w-[160px] h-[160px] rounded-[12px]'
          alt='Collection'
        />
        <div className='ml-6 w-[600px]'>
          <h3 className='text-[26px] font-bold'>{CollectionDetail.name}</h3>
          <p className='text-textLight text-sm'>
            {CollectionDetail?.contract_address
              ? CollectionDetail?.contract_address
              : 'Smart Contract not released'}
            <i
              className={`fa-solid fa-copy ml-2 ${
                CollectionDetail?.contract_address
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
              disabled={!CollectionDetail.contract_address}
              onClick={() =>
                copyToClipboard(CollectionDetail?.contract_address)
              }
            ></i>
            <span id='copied-message' className='hidden ml-2'>
              Copied !
            </span>
          </p>
          <h4 className='text-[18px] font-bold mt-4'>About the Collection</h4>
          <p className='text-[14px] text-[#5F6479]'>
            {CollectionDetail?.description}
          </p>
        </div>
        <div className='ml-auto'>
          <Link to='/collection-create'>
            <button className='rounded-[4px] p-2 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-black w-[127px] '>
              Edit Collection
            </button>
          </Link>
        </div>
      </div>
      {/* <h3 className='text-[28px] font-black'>Rights Attached NFT</h3>
      <p className='text-[14px] font-regular text-[#5F6479] mt-2'>
        Dashboard that you can control the royalties share.
      </p>
      <div className='flex items-center mt-3'>
        <p className='text-[16px] font-black'>Member 3/5</p>
        <button className='rounded-[4px] p-2 ml-3 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold'>
          Upgrade Plan
        </button>
      </div> */}
      {IsNFTAvailable ? (
        <div className='w-[680px] mt-4'>
          <div className='flex items-end'>
            <DropdownCreabo
              label='Connect Collection'
              value={selectedCollectionId}
              id='select-collection'
              defaultValue='Select Collection'
              handleChange={handleChange}
              options={Collections}
            />
            <div className='ml-4'>
              <button
                onClick={handleConnectCollection}
                className='rounded-[4px] p-2 py-3 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-black w-[127px] '
              >
                Connect
              </button>
            </div>
            {ConnectedSuccessfully ? (
              <p className='text-green-600 mb-2 text-[14px] ml-2'>
                Connected Successfully!
              </p>
            ) : null}
          </div>
          <Link to='/collection-create'>
            <button className='rounded-[4px] p-2 mt-4 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold flex items-center w-[127px] justify-center'>
              <img src={CirclePlus} alt='Add' />{' '}
              <span className='ml-[6px]'>Add Collection</span>
            </button>
          </Link>
        </div>
      ) : (
        <p className='text-center mt-4'>
          This collection does not have Right Attached NFT
        </p>
      )}
      {/* {data?.members ? ( */}
      <div
        className={`bg-white mt-6 rounded-[12px] p-6 ${styles.memberSection}`}
      >
        <div className='flex justify-between pb-7 border-b-[1px] mb-6 border-[#E3DEEA]'>
          <h3 className='text-[18px] font-black'>Member List</h3>
          {ShowPercentError ? (
            <p className='text-red-400 text-[14px] mt-1'>
              Total percent of members should equal to or lesser than 100%
            </p>
          ) : null}
          {data?.members?.length ? (
            <div class='flex items-center justify-center'>
              <div class='form-check form-switch flex items-center'>
                <p class='text-[#303548] text-[12px] mr-5'>
                  Autofill Percentage
                </p>
                <input
                  class='form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                  type='checkbox'
                  checked={AutoAssign}
                  role='switch'
                  onChange={handleAutoAssign}
                />
              </div>
            </div>
          ) : null}
        </div>
        {data?.members?.length ? (
          <MemberListTable
            list={data?.members}
            headers={TABLE_HEADERS}
            handlePublish={setShowPublish}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            handleValueChange={handleValueChange}
            handleAutoFill={handleAutoFill}
          />
        ) : (
          <p className='text-center mt-4'>
            There is no collaborator yet, please publish collection and you can
            start inviting members.
          </p>
        )}
        {CollectionDetail.status !== 'published' ? (
          <div className='w-full'>
            <button
              className='block ml-auto rounded-[4px] bg-[#9A5AFF] text-white text-[12px] font-bold px-4 py-2'
              onClick={() => setShowPublish(true)}
            >
              Publish
            </button>
          </div>
        ) : null}
      </div>
      {/* ) : null} */}
      <div className='flex mb-8'>
        <div className='bg-white mt-6 p-6 w-2/4 mr-2 rounded-[12px]'>
          <h3 className='text-[18px] font-black'>Invite Contributor</h3>
          {data?.lnft?.invitation_code ? (
            <>
              <p className='text-[12px] text-[#5F6479] mb-6'>
                Invite anothe contributor to get the royalties by copy this link
                and ask the to claim the Right Attached NFT
              </p>
              {/* <div className='w-full'>
            <label for='invite-address' className='text-[12px] text-[#5F6479]'>
              Invite with Wallet Address
            </label>
            <input
              id='invite-address'
              placeholder='Add wallet Address'
              className='text-[14px] block mb-2 py-[10px] pl-[15px] pr-[40px} text-[#9A5AFF] w-full rounded-[12px] border-[1px] border-[#C7CEE5] mt-1'
              value=''
            />
            <button className='ml-auto block rounded-[4px] p-2 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold w-[110px]'>
              Invite
            </button>
          </div> */}
              <div className='mt-2'>
                <p className='text-[12px] text-[#5F6479] mb-1'>
                  Invite with link
                </p>
                <div className='relative w-fit'>
                  <p
                    className='text-[16px] block py-[10px] pl-[15px] pr-[40px] bg-opacity-[0.1] bg-[#9A5AFF] text-[#9A5AFF] w-full rounded-[12px]'
                    id='iframe'
                  >
                    Link:{' '}
                    <span className='font-black'>
                      {origin}/{data?.lnft?.invitation_code}
                    </span>
                  </p>
                  <div className='text-[#9A5AFF] absolute top-2 right-2'>
                    <i
                      className='fa fa-copy text-lg cursor-pointer'
                      onClick={() =>
                        copyToClipboardShare(
                          `${origin}/${data?.lnft?.invitation_code}`
                        )
                      }
                    ></i>
                  </div>
                  <p
                    id='copied-share-message'
                    className='hidden text-green-500 text-[14px] text-center'
                  >
                    Copied Successfully!
                  </p>
                </div>
              </div>
              <div>
                <p className='text-[12px] text-[#5F6479] mt-[46px] mb-1'>
                  Invite with
                </p>
                <div className='flex items-center'>
                  <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={FB} alt='facebook' />
                  </div>
                  <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={twitter} alt='twitter' />
                  </div>
                  <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={reddit} alt='reddit' />
                  </div>
                  <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={instagram} alt='instagram' />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className='text-[12px] text-[#5F6479] mb-6'>
              Please publish collection to view invitation link
            </p>
          )}
        </div>
        {data?.lnft?.asset?.path ? (
          <div className='bg-white mt-6 p-6 w-2/4 ml-2 rounded-[12px] flex items-center justify-center flex-col'>
            <h3 className='text-[18px] font-black'>Right Attached NFT</h3>
            <img
              src={data?.lnft?.asset?.path}
              alt='NFT'
              className='mt-5 h-[189px] w-[189px]'
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoyalityManagement;