/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { round } from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { uniqBy } from 'lodash';
import {
  getCollectionNFTs,
  getCollectionDetailsById,
  getSplitterDetails,
  updateRoyaltySplitter,
  getCollectionSales,
  getNetWorth,
  getProductNFTCollectionSalesSetupInformation,
  addCollectionSplitter,
  deleteUnpublishedSplitter,
  detachSplitterFormCollection,
} from 'services/collection/collectionService';
import Spinner from 'components/Commons/Spinner';
import Cover from 'assets/images/cover-default.svg';
import manImg from 'assets/images/image-default.svg';
import avatar from 'assets/images/dummy-img.svg';
import Link from 'next/link';
import PublishCollectionModal from './Publish/PublishCollectionModal';
import SalesPageModal from './SaleSetting/SalesPageModal';
import SuccessModal from 'components/Modals/SuccessModal';
import DeployingCollectiontModal from './Publish/DeployingCollectionModal';
import ErrorModal from 'components/Modals/ErrorModal';
import Facebook from 'assets/images/facebook.svg';
import Instagram from 'assets/images/instagram.svg';
import Twitter from 'assets/images/twitter.svg';
import Github from 'assets/images/github.svg';
import Reddit from 'assets/images/reddit.svg';
import ExternalLink from 'assets/images/link.svg';
import TransferNFT from 'components/NFT/TransferNFT/TransferNFT';
import { getProjectDetailsById } from 'services/project/projectService';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import Bnb from 'assets/images/network/bnb.svg';
import MemberListTable from './RoyaltySplitter/MemberListTable';
import PlusIcon from 'assets/images/icons/plus-circle.svg';
import NFTSales from './NFTSale';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import ImportWalletModal from './RoyaltySplitter/ImportWalletModal/ImportWalletModal';
import usePublishRoyaltySplitter from './RoyaltySplitter/Publish/hooks/usePublishRoyaltySplitter';
import PublishRoyaltyModal from './RoyaltySplitter/Publish/PublishRoyaltyModal';
import SalesSuccessModal from './SaleSetting/SalesSuccessModal';
import defaultCover from 'assets/images/image-default.svg';
import { walletAddressTruncate } from 'util/WalletUtils';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import tickSvg from 'assets/images/icons/tick.svg';
import editImage from 'assets/images/edit-white.svg';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { getNftDetails } from 'services/nft/nftService';
import PublishRoyaltyConfirmModal from './Publish/PublishRoyaltyConfirmModal';
import Image from 'next/image';
import DaoConnectModal from 'components/Collection/DaoConnectModal/DaoConnectModal';
import WithdrawModal from './WithdrawModal';
import {
  getSplitterList,
  attachSplitterToCollection,
} from 'services/collection/collectionService';
import Select from 'react-select';
import { NETWORKS } from 'config/networks';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ls_GetWalletType, ls_GetChainID } from 'util/ApplicationStorage';
import audioWeb from 'assets/images/token-gated/audioWeb.svg';
import SocialLink from 'components/Commons/SocialLink';
import NFTTab from './NFTTab/NFTTab';

const currency = {
  eth: Eth,
  matic: Polygon,
  bnb: Bnb,
};

const TABLE_HEADERS = [
  { id: 0, label: 'Name' },
  { id: 1, label: 'Wallet Address' },
  { id: 2, label: 'Percentage' },
  { id: 3, label: 'Role' },
  { id: 4, label: 'Action' },
];
const imageRegex = new RegExp('image');

const CollectionContent = ({ collectionId, userId }) => {
  const router = useRouter();
  const [Collection, setCollection] = useState();
  const [CoverImages, setCoverImages] = useState({});
  const [NFTs, setNFTs] = useState([]);
  const [Links, setLinks] = useState([]);
  const [ShowPublishModal, setShowPublishModal] = useState(false);
  const [ShowOptions, setShowOptions] = useState(null);
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionType, setCollectionType] = useState('');
  const [nftId, setNftId] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [tnxData, setTnxData] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Logo, setLogo] = useState({});
  const [showTransferNFT, setShowTransferNFT] = useState(false);
  const [projectNetwork, setProjectNetwork] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const [isEdit, setIsEdit] = useState(null);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [royalitySplitterId, setRoyalitySpliterId] = useState('');
  const [royalityMembers, setRoyalityMembers] = useState([]);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState('');
  const [showImportWallet, setShowImportWallet] = useState(false);
  const [projectID, setProjectID] = useState('');
  const [nftSales, setNFTSales] = useState([]);
  const [nftMemSupply, setNftMemSupply] = useState(0);
  const [daoInfo, setDaoInfo] = useState({});
  const [nftShareURL, setNFTShareURL] = useState('');
  const [membershipNFTId, setMembershipNFTId] = useState('');
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [collectionNetwork, setCollectionNetwork] = useState();
  const [collectionNotUpdatableModal, setCollectionNotUpdatableModal] =
    useState(false);
  const [setSalesError, setSetSalesError] = useState(false);
  const [salesSetupInfo, setSalesSetupInfo] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [showDaoConnectModal, setShowDaoConnectModal] = useState(false);
  // Publish royalty splitter
  const [showPublishRoyaltySpliterModal, setShowPublishRoyaltySpliterModal] =
    useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [
    showPublishRoyaltySpliterConfirmModal,
    setShowPublishRoyaltySpliterConfirmModal,
  ] = useState();
  const [isSalesPrice, setIsSalesPrice] = useState(false);
  const [
    showPublishRoyaltySpliterErrorModal,
    setShowPublishRoyaltySpliterErrorModal,
  ] = useState(false);
  const hasPublishedRoyaltySplitter = useMemo(
    () => Collection?.royalty_splitter?.status === 'published',
    [Collection]
  );
  const [splitter, setSplitter] = useState();
  const [createNewSplitter, setCreateNewSplitter] = useState(false);
  const [payload, setPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [options, setOptions] = useState([]);
  const [isSplitterLoading, setIsSplitterLoading] = useState(false);
  const [addSplitterLoading, setAddSplitterLoading] = useState(false);
  const [blockchain, setBlockchain] = useState('');
  const [splitterName, setSplitterName] = useState('');
  const [isSplitterSubmitted, setIsSplitterSubmitted] = useState(false);
  const [applySplitterSubmitted, setApplySplitterSubmitter] = useState(false);
  const [isSplitterAdded, setIsSplitterAdded] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isMembersCreated, setIsMembersCreated] = useState(false);
  const [splitterAddress, setSplitterAddress] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConformModalMessage] = useState('');
  const [detachOrDeleteAction, setDetachOrDeleteAction] = useState('');
  const [showGlobalSuccessModal, setShowGlobalSuccessModal] = useState(false);
  const [showGlobalErrorModal, setShowGlobalErrorModal] = useState(false);
  const [showGlobalSuccessModalMessage, setShowGlobalSuccessModalMessage] =
    useState('');
  const [showGlobalErrorModalMessage, setShowGlobalErrorModalMessage] =
    useState('');
  const [splitterKey, setSplitterKey] = useState(0);
  let walletType = ls_GetWalletType();
  const [nftListSortBy, setNFTListSoryBy] = useState('newer');
  useEffect(() => {
    if (hasNextPageData) {
      getSplitters(Collection?.blockchain);
    }
  }, [payload, userId]);

  useEffect(() => {
    setSelectedTab(1);
  }, [userId]);

  const getSplitters = async (network, resetSplitter) => {
    setIsSplitterLoading(true);
    await getSplitterList(payload.page, payload.perPage)
      .then((res) => {
        setIsSplitterLoading(false);
        let chain = network ? network : Collection?.blockchain;
        let filteredSplitters =
          chain &&
          res?.splitters.filter((split) => split?.blockchain === chain);
        const splitterList = resetSplitter ? [] : [...options];
        const mergedSplitterList = [...splitterList, ...filteredSplitters];
        const uniqSplitterList = uniqBy(mergedSplitterList, function (e) {
          return e.id;
        });

        setOptions(uniqSplitterList);
        if (res?.splitters?.length === 0) {
          setHasNextPageData(false);
        }
      })
      .catch((res) => {
        setIsSplitterLoading(false);
      });
  };

  const hanldeUpdatePublishStatus = (status) => {
    if (status === 'success') {
      if (Collection?.royalty_splitter?.status !== 'published') {
        setCollection({
          ...Collection,
          royalty_splitter: {
            ...Collection.royalty_splitter,
            status: 'published',
          },
        });
      }
    }
  };

  const {
    isLoading: isPublishingRoyaltySplitter,
    status: publishRoyaltySplitterStatus,
    canPublish: canPublishRoyaltySplitter,
    publish: publishRoyaltySplitter,
    contractAddress,
    setIsLoading: setPublishingSplitter,
  } = usePublishRoyaltySplitter({
    collection: Collection,
    splitters: royalityMembers,
    onUpdateStatus: hanldeUpdatePublishStatus,
  });

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [newWorth, setNetWorth] = useState({
    balance: 0,
    currency: '',
    balanceUSD: 0,
  });

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail();

      getNFTs();
      getCollectionSalesData();
      getCollectionNewWorth();
    }
  }, [collectionId, userId]);

  const getCollectionSalesData = () => {
    getCollectionSales(collectionId).then((data) =>
      setNFTSales(data?.sales ? data?.sales : [])
    );
  };

  const getCollectionNewWorth = () => {
    setBalanceLoading(true);
    getNetWorth(collectionId).then((resp) => {
      if (resp?.code === 0) {
        setBalanceLoading(false);
        setNetWorth({
          balance: resp.balance,
          currency: resp.currency,
          balanceUSD: resp.balance_usd,
        });
      } else {
        setBalanceLoading(false);
        setNetWorth({ balance: 0, currency: '', balanceUSD: 0 });
      }
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(collectionId)
      .then((resp) => {
        if (resp?.code === 0) {
          setNFTs(resp.lnfts);
        }
      })
      .catch((err) => console.log(err));
  };

  const getSplittedContributors = (id, type) => {
    getSplitterDetails(id, type).then((data) => {
      if (data.code === 0) {
        setSplitterName(data?.splitter?.name);
        setBlockchain(data?.splitter?.blockchain);
        setRoyalityMembers(data?.members);
        setSplitterAddress(data?.splitter?.contract_address);
        if (data?.members?.length) {
          setIsMembersCreated(true);
        } else {
          setIsMembersCreated(false);
        }
      }
    });
  };

  const getCollectionDetail = async (resetSplitter) => {
    let payload = {
      id: collectionId,
    };
    await getCollectionDetailsById(payload)
      .then((resp) => {
        if (resp?.code === 0) {
          setProjectID(resp?.collection?.project_uid);
          if (resp?.collection?.blockchain) {
            getSplitters(resp.collection.blockchain, resetSplitter);
            setBlockchain(resp.collection.blockchain);
          }
          setCollectionNetwork(resp?.collection?.blockchain);
          if (resp?.collection?.project_uid) {
            getProjectDetailsById({ id: resp?.collection?.project_uid }).then(
              (resp) => {
                setProjectNetwork(resp?.project?.blockchain);
                setDaoInfo(resp?.project);
              }
            );
          }
          if (resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId(resp.collection.royalty_splitter.id);
            getSplittedContributors(resp.collection.royalty_splitter.id);

            setIsSplitterAdded(true);
          } else if (!resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId('');
          }

          setCollection(resp.collection);
          setCollectionType(resp.collection.type);
          if (resp?.collection?.assets && resp.collection.assets.length > 0) {
            setCoverImages(
              resp.collection.assets.find(
                (img) => img['asset_purpose'] === 'cover'
              )
            );
            setLogo(
              resp.collection.assets.find(
                (img) => img['asset_purpose'] === 'logo'
              )
            );
          }
          if (resp?.collection?.links) {
            const webLinks = [];
            try {
              const urls = JSON.parse(resp.collection.links);
              for (let url of urls) {
                webLinks.push({
                  title: Object.values(url)[0],
                  value: Object.values(url)[2],
                });
              }
            } catch {}
            setLinks(webLinks);
          }
          if (resp?.collection?.type === 'product') {
            getSalesSetupInfo('product', resp?.collection?.id);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }

  const handleAutoAssign = (e) => {
    let memberCount = royalityMembers.length;

    if (!memberCount) {
      return;
    }

    setAutoAssign(!AutoAssign);

    let value = 100 / memberCount;
    let values = royalityMembers.map((mem) => {
      return {
        ...mem,
        royalty_percent: parseFloat(round(value, 18)),
      };
    });
    setRoyalityMembers(values);
  };

  const useDebounceCallback = (delay = 100, cleaning = true) => {
    // or: delayed debounce callback
    const ref = React.useRef();
    React.useEffect(() => {
      if (cleaning) {
        // cleaning uncalled delayed callback with component destroying
        return () => {
          if (ref.current) clearTimeout(ref.current);
        };
      }
    }, []);
    return (callback) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(callback, delay);
    };
  };
  const delayCallback = useDebounceCallback(500);

  async function salesPageModal(e, type, id, supply) {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'product') {
      setShowOptions(null);
      setShowSalesPageModal(true);
    } else {
      if (Collection?.status === 'published') {
        setShowOptions(null);
        setNftId(id);
        setNftMemSupply(supply);
        await getSalesSetupInfo('membership', id);
        setShowSalesPageModal(true);
      } else {
        setSetSalesError(true);
      }
    }
  }

  const handlePublish = () => {
    setShowPublishModal(false);
    if (Collection.status === 'publishing') {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  };

  const handleAutoFill = (e, publish) => {
    setIsSplitterSubmitted(true);
    if (splitterName && blockchain) {
      let members = royalityMembers.map((mem) => {
        return {
          wallet_address: mem.user_eoa,
          royalty: mem.royalty_percent,
          role: mem.custom_role,
          name: mem.custom_name,
        };
      });
      let formData = new FormData();
      formData.append('royalty_data', JSON.stringify(members));
      splitterName && formData.append('name', splitterName);
      blockchain && formData.append('blockchain', blockchain);
      royalitySplitterId
        ? formData.append('splitter_uid', royalitySplitterId)
        : Collection?.id
        ? formData.append('collection_uid', Collection.id)
        : null;
      if (!ShowPercentError) {
        setIsAutoFillLoading(true);
        updateRoyaltySplitter(formData)
          .then((resp) => {
            if (resp.code === 0) {
              if (publish) {
                publishRoyaltySplitter(resp.splitter_id);
              } else {
                setShowGlobalSuccessModal(true);
                setShowGlobalSuccessModalMessage(
                  'Royalty Splitter Successfully Saved'
                );
                setIsAutoFillLoading(false);
                setAutoAssign(false);
                setIsEdit(null);
                setShowRoyalityErrorModal(false);
                setShowRoyalityErrorMessage('');
                getSplittedContributors(royalitySplitterId);
                getCollectionDetail();
              }
            } else {
              setIsAutoFillLoading(false);
              setRoyaltyUpdatedSuccessfully(false);
              setShowRoyalityErrorModal(true);
              setAutoAssign(false);
              setShowRoyalityErrorMessage(resp.message);
            }
          })
          .catch((err) => {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(false);
            setAutoAssign(false);
          });
      }
    }
  };

  const handleValueChange = (e, id) => {
    let values = royalityMembers.map((mem) => {
      if (id === mem.user_eoa) {
        return {
          ...mem,
          royalty_percent: parseFloat(e.target.value),
        };
      }
      return mem;
    });

    let percent = royalityMembers.reduce(
      (acc, val) => acc + val.royalty_percent,
      0
    );

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setRoyalityMembers(values);
  };

  const handlePublishRoyaltySplitterButtonClick = async () => {
    setShowPublishRoyaltySpliterConfirmModal(true);
  };

  const handlePublishRoyaltySplitter = async () => {
    setPublishingSplitter(true);
    try {
      setShowPublishRoyaltySpliterConfirmModal(false);
      setShowPublishRoyaltySpliterModal(true);
      if (isMembersCreated) {
        await publishRoyaltySplitter();
      } else {
        await handleAutoFill(null, true);
      }
    } catch (err) {
      setShowPublishRoyaltySpliterModal(false);
      setShowPublishRoyaltySpliterErrorModal(true);
      console.error(err);
    }
  };

  const handlePublishModal = async () => {
    if (walletType === 'metamask') {
      let networkId = await getCurrentNetworkId();
      setShowSuccessModal(false);
      if (Number(collectionNetwork) === networkId) {
        if (Collection?.type === 'product') {
          if (salesSetupInfo?.price) {
            setShowPublishModal(true);
            setIsSalesPrice(false);
          } else {
            setIsSalesPrice(true);
          }
        } else {
          setShowPublishModal(true);
        }
      } else {
        setShowNetworkHandler(true);
      }
    } else if (walletType === 'magicwallet') {
      let chainId = await ls_GetChainID();
      if (Number(collectionNetwork) === chainId) {
        setShowSuccessModal(false);
        if (Collection?.type === 'product') {
          if (salesSetupInfo?.price) {
            setShowPublishModal(true);
            setIsSalesPrice(false);
          } else {
            setIsSalesPrice(true);
          }
        } else {
          setShowPublishModal(true);
        }
      } else {
        setShowNetworkHandler(true);
      }
    }
  };

  const handlePublishSpliter = async () => {
    setIsPublishing(true);
    if (blockchain && splitterName && royalityMembers.length) {
      if (walletType === 'metamask') {
        let networkId = await getCurrentNetworkId();
        if (Number(collectionNetwork) === networkId) {
          let totalPercent = royalityMembers.reduce(
            (arr, val) => arr + val.royalty_percent,
            0
          );
          if (totalPercent === 100) {
            setShowPublishRoyaltySpliterConfirmModal(true);
          } else {
            toast.error('Total royalty percent should be 100 %');
          }
        } else {
          setShowNetworkHandler(true);
        }
      } else if (walletType === 'magicwallet') {
        let chainId = await ls_GetChainID();
        if (Number(collectionNetwork) === chainId) {
          let totalPercent = royalityMembers.reduce(
            (arr, val) => arr + val.royalty_percent,
            0
          );
          if (totalPercent === 100) {
            setShowPublishRoyaltySpliterConfirmModal(true);
          } else {
            toast.error('Total royalty percent should be 100 %');
          }
        } else {
          setShowNetworkHandler(true);
        }
      }
    }
  };

  const getSalesSetupInfo = async (type, id) => {
    if (type === 'product') {
      await getProductNFTCollectionSalesSetupInformation(id)
        .then((res) => {
          if (res.code === 0) {
            setSalesSetupInfo(res?.more_info);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === 'membership') {
      // calling membership nft details api because sales setup info can found in the response
      setDataLoading(true);
      await getNftDetails('membership', id)
        .then((resp) => {
          if (resp.code === 0) {
            setSalesSetupInfo(resp?.more_info);
          }
          setDataLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setDataLoading(false);
        });
    }
  };

  const handleWithdrawModel = async (e) => {
    e.preventDefault();
    if (walletType === 'metamask') {
      let networkId = await getCurrentNetworkId();
      if (Number(collectionNetwork) === networkId) {
        setShowWithdrawModal(true);
      } else {
        setShowNetworkHandler(true);
      }
    } else if (walletType === 'magicwallet') {
      let chainId = await ls_GetChainID();
      if (Number(collectionNetwork) === chainId) {
        setShowWithdrawModal(true);
      } else {
        setShowNetworkHandler(true);
      }
    }
  };

  function scrolledBottom() {
    let oldPayload = { ...payload };
    oldPayload.page = oldPayload.page + 1;
    setPayload(oldPayload);
  }

  async function onSplitterSearch(keyword) {
    delayCallback(() => {
      let oldPayload = { ...payload };
      oldPayload.keyword = keyword;
      setPayload(oldPayload);
    });
  }

  let isSupplyOver = Collection?.total_supply <= NFTs?.length;

  const handleSelectedSplitter = (e) => {
    setApplySplitterSubmitter(true);
    e.preventDefault();
    if (splitter?.id) {
      setAddSplitterLoading(true);
      let data = {
        id: Collection.id,
        splitter: splitter.id,
        supply: Collection.total_supply,
      };
      attachSplitterToCollection(Collection.id, splitter.id)
        .then((resp) => {
          if (resp?.code === 0) {
            setAddSplitterLoading(false);
            toast.success('Splitter added to collection Successfully');
            getCollectionDetail();
            setApplySplitterSubmitter(false);
          } else {
            setAddSplitterLoading(false);
            setApplySplitterSubmitter(false);
            toast.error(resp?.message);
          }
        })
        .catch((err) => {});
    }
  };

  let validNetworks = NETWORKS
    ? Object.values(NETWORKS).filter((net) => net.network)
    : [];

  const onConfirmFromModal = async () => {
    setConformModalMessage('');
    setShowConfirmModal(false);
    setDataLoading(true);

    if (detachOrDeleteAction === 'detach') {
      await detachSplitterFormCollection(Collection?.id)
        .then(async (resp) => {
          if (resp?.code === 0) {
            setCreateNewSplitter(false);
            setIsSplitterAdded(false);
            setOptions([]);
            setSelectedTab(1);
            setSplitter(null);
            setSplitterName('');
            setRoyalityMembers([]);
            setSplitterKey((pre) => pre + 1);
            await getCollectionDetail();
            setShowGlobalSuccessModalMessage('Successfully Detached Splitter');
            setShowGlobalSuccessModal(true);
            setDataLoading(false);
            setSelectedTab(2);
          } else {
            setShowGlobalErrorModalMessage(resp?.message);
            setShowGlobalErrorModal(true);
            setDataLoading(false);
          }
        })
        .catch((err) => {
          setDataLoading(false);
        });
    } else if (detachOrDeleteAction === 'delete') {
      await deleteUnpublishedSplitter(Collection?.royalty_splitter?.id)
        .then(async (res) => {
          if (res?.code === 0) {
            setCreateNewSplitter(false);
            setIsSplitterAdded(false);
            setSelectedTab(1);
            setOptions([]);
            setSplitter(null);
            setSplitterName('');
            setRoyalityMembers([]);
            setSplitterKey((pre) => pre + 1);
            await getCollectionDetail('resetSplitter');
            setShowGlobalSuccessModalMessage('Successfully Deleted Splitter');
            setShowGlobalSuccessModal(true);
            setDataLoading(false);
            setSelectedTab(2);
            setSplitterKey((pre) => pre + 1);
          } else {
            setShowGlobalErrorModalMessage(res?.message);
            setShowGlobalErrorModal(true);
            setDataLoading(false);
          }
        })
        .catch((err) => {
          setDataLoading(false);
          console.log(err);
        });
    }
  };
  const detachSplitter = async () => {
    setDetachOrDeleteAction('detach');
    setConformModalMessage('Are you sure to detach this splitter?');
    setShowConfirmModal(true);
  };
  const deleteSplitter = async () => {
    setDetachOrDeleteAction('delete');
    setConformModalMessage('Are you sure to delete this splitter?');
    setShowConfirmModal(true);
  };
  const onShowSalesPageModal = (salesInfo) => {
    salesPageModal(
      salesInfo.event,
      salesInfo.collection_type,
      salesInfo.nft_id,
      salesInfo.supply
    );
  };
  const onNFTSort = async (order_by) => {
    setDataLoading(true);
    await getCollectionNFTs(collectionId, order_by)
      .then((resp) => {
        setDataLoading(false);
        if (resp?.code === 0) {
          setNFTs(resp.lnfts);
          setNFTListSoryBy(order_by);
        }
      })
      .catch((err) => setDataLoading(false));
  };

  return (
    <>
      <div className='mx-4'>
        {dataLoading && <div className='loading'></div>}
        {showNetworkHandler && (
          <NetworkHandlerModal
            show={showNetworkHandler}
            handleClose={() => setShowNetworkHandler(false)}
            projectNetwork={collectionNetwork}
          />
        )}
        {showWithdrawModal && (
          <WithdrawModal
            show={showWithdrawModal}
            handleClose={() => setShowWithdrawModal(false)}
            id={Collection?.id}
            network={Collection?.blockchain}
            price={newWorth?.balance}
            contractAddress={Collection?.contract_address}
            type={Collection?.type}
            getCollectionNewWorth={getCollectionNewWorth}
          />
        )}
        {ShowPublishModal && (
          <PublishCollectionModal
            show={ShowPublishModal}
            handleClose={() => setShowPublishModal(false)}
            publishProject={handlePublish}
            isRoyaltyPublished={Collection?.royalty_splitter?.contract_address}
            type='Collection'
          />
        )}
        {RoyaltyUpdatedSuccessfully && (
          <SuccessModal
            show={RoyaltyUpdatedSuccessfully}
            handleClose={setRoyaltyUpdatedSuccessfully}
            message='Royalty Percentage Updated Successfully'
            btnText='Done'
          />
        )}
        {showRoyalityErrorModal && (
          <ErrorModal
            title={'Failed to apply royalty percentage!'}
            message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setShowRoyalityErrorModal(false);
              setShowRoyalityErrorMessage(null);
              setAutoAssign(false);
            }}
            show={showRoyalityErrorModal}
          />
        )}
        {setSalesError && (
          <ErrorModal
            title={'Collection not published yet!'}
            // message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setSetSalesError(false);
            }}
            show={setSalesError}
          />
        )}
        {isSalesPrice && (
          <ErrorModal
            title={'Please set the sales price to publish the collection!'}
            // message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setIsSalesPrice(false);
            }}
            show={isSalesPrice}
          />
        )}
        {AutoAssign && (
          <ConfirmationModal
            show={AutoAssign}
            handleClose={setAutoAssign}
            handleApply={handleAutoFill}
            message='This will apply royalty percentage to all the members equally. Are you
          sure, you want to proceed?'
          />
        )}
        {showErrorModal && (
          <ErrorModal
            title={'Collection Publish failed !'}
            message={`${errorMsg}`}
            handleClose={() => {
              setShowErrorModal(false);
              setErrorMsg(null);
            }}
            redirection={
              errorMsg === `DAO is not published yet `
                ? `/dao/${Collection?.project_uid}`
                : false
            }
            show={showErrorModal}
            buttomText={
              errorMsg === `DAO is not published yet ` ? 'View DAO' : 'Close'
            }
          />
        )}
        {showDeployModal && (
          <DeployingCollectiontModal
            show={showDeployModal}
            handleClose={(status) => {
              setShowDeployModal(status);
              const payload = {
                id: collectionId,
              };
              getCollectionDetail();
            }}
            errorClose={(msg) => {
              setErrorMsg(msg);
              setShowDeployModal(false);
              setShowErrorModal(true);
            }}
            tnxData={tnxData}
            collectionId={Collection?.id}
            collectionName={Collection?.name}
            collectionSymbol={Collection?.symbol}
            collectionType={Collection?.type}
            publishStep={publishStep}
            productPrice={salesSetupInfo?.price}
          />
        )}
        {showTransferNFT && (
          <TransferNFT
            show={showTransferNFT}
            handleClose={() => setShowTransferNFT(false)}
          />
        )}
        {showImportWallet && (
          <ImportWalletModal
            show={showImportWallet}
            handleClose={() => {
              setShowImportWallet(false);
              getCollectionDetail();
              getSplittedContributors(
                royalitySplitterId ? royalitySplitterId : Collection.id,
                royalitySplitterId ? 'splitter_id' : 'collection_id'
              );
            }}
            projectId={projectID}
            collectionName={Collection?.name}
            collectionId={Collection?.id}
            handleValueChange={handleValueChange}
            handleAutoFill={handleAutoFill}
            royalityMembers={royalityMembers}
            setRoyalityMembers={setRoyalityMembers}
            showPercentError={ShowPercentError}
            royalitySplitterId={royalitySplitterId}
            setRoyaltyUpdatedSuccessfully={setRoyaltyUpdatedSuccessfully}
            setShowRoyalityErrorModal={setShowRoyalityErrorModal}
            setShowRoyalityErrorMessage={setShowRoyalityErrorMessage}
            blockchain={blockchain}
            splitterName={splitterName}
          />
        )}
        {collectionNotUpdatableModal && (
          <ErrorModal
            title={'NFT is not updatable'}
            message={`once its collection is published or its metadata was freezed`}
            handleClose={() => {
              setCollectionNotUpdatableModal(false);
            }}
            show={collectionNotUpdatableModal}
          />
        )}
        {showDaoConnectModal && (
          <DaoConnectModal
            show={showDaoConnectModal}
            handleClose={() => setShowDaoConnectModal(false)}
            userId={userId}
            collection={Collection}
            dao={daoInfo}
            onSuccessFullyConnect={() => getCollectionDetail()}
          />
        )}
        {showConfirmModal && (
          <ConfirmationModal
            show={showConfirmModal}
            handleClose={() => {
              setDetachOrDeleteAction('');
              setConformModalMessage('');
              setShowConfirmModal(false);
            }}
            handleApply={() => onConfirmFromModal()}
            message={confirmModalMessage}
          />
        )}
        {showGlobalSuccessModal && (
          <SuccessModal
            show={showGlobalSuccessModal}
            handleClose={() => {
              setShowGlobalSuccessModalMessage('');
              setShowGlobalSuccessModal(false);
            }}
            message={showGlobalSuccessModalMessage}
            btnText='Close'
          />
        )}
        {showGlobalErrorModal && (
          <ErrorModal
            title={'Opps, Something went wrong'}
            message={showGlobalErrorModalMessage}
            handleClose={() => {
              setShowGlobalErrorModalMessage('');
              setShowGlobalErrorModal(false);
            }}
            show={showGlobalErrorModal}
          />
        )}
        <section className='mt-6'>
          <div className='row-span-2 col-span-2'>
            <Image
              className='rounded-xl object-cover h-[124px] md:h-[260px] w-full'
              src={CoverImages?.path ? CoverImages?.path : Cover}
              alt=''
              height={260}
              width={100}
              unoptimized
            />
          </div>
        </section>
        <section
          className={`gray-linear-gradient-background rounded-b-xl mt-4 p-6 shadow-main`}
        >
          <div className='flex flex-col md:flex-row'>
            <div className='flex-1 md:w-2/3'>
              <div className='flex'>
                <Image
                  src={Logo?.path ? Logo?.path : manImg}
                  className='rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6'
                  alt='User profile'
                  width={98}
                  height={98}
                  unoptimized
                />
                <div className='flex-1 min-w-0  px-4'>
                  <div className='flex items-center mb-1 md:mb-2'>
                    <h2 className='truncate'>{Collection?.name}</h2>
                    {Collection?.status === 'published' && (
                      <Image
                        className='ml-1 mt-1'
                        src={tickSvg}
                        alt=''
                        height={17}
                        width={17}
                      />
                    )}
                  </div>

                  {userId && Collection?.is_owner && (
                    <>
                      <div>
                        {daoInfo?.id ? (
                          <>
                            <p className='my-2 text-textLight md:text-sm text:xs md:flex items-center'>
                              Connected With :
                              <Link
                                className='md:ml-2 mt-1 mb-2 md:mb-0 md:mt-0 font-bold flex items-center !no-underline'
                                href={`/dao/${daoInfo?.id}`}
                              >
                                <Image
                                  className='h-[24px] w-[24px] rounded-full mr-1'
                                  src={
                                    daoInfo?.assets?.length > 0
                                      ? daoInfo.assets.find(
                                          (img) =>
                                            img['asset_purpose'] === 'cover'
                                        )
                                        ? daoInfo.assets.find(
                                            (img) =>
                                              img['asset_purpose'] === 'cover'
                                          ).path
                                        : defaultCover
                                      : defaultCover
                                  }
                                  width={24}
                                  height={24}
                                  alt='collection cover'
                                />
                                {daoInfo?.name}
                              </Link>
                              {Collection?.status === 'draft' && (
                                <span
                                  onClick={() => setShowDaoConnectModal(true)}
                                  className='py-1 rounded cursor-pointer social-icon-button text-primary-900  md:ml-2 px-2'
                                >
                                  <i className='fa-solid  fa-pen-to-square '></i>
                                  Change DAO
                                </span>
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            {Collection?.status === 'draft' && (
                              <p
                                className='bg-primary-900/[0.08] rounded mt-1 text-sm w-fit  text-primary-900 font-bold cursor-pointer p-2'
                                onClick={() => setShowDaoConnectModal(true)}
                              >
                                <i className='fa-solid fa-link mr-2'></i>
                                Connect DAO
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className='flex flex-wrap mt-5 items-start md:justify-end md:w-1/3 md:mt-0'>
              <SocialLink links={Links} />
            </div>
          </div>

          <div className='flex flex-col md:flex-row pt-5'>
            <div className='md:w-2/3'>
              <h3>About The Collection</h3>
              <div className='text-textLight text-sm'>
                {Collection?.description ? (
                  <div className='whitespace-pre-line text-textLight break-all text-sm'>
                    <ReactReadMoreReadLess
                      charLimit={300}
                      readMoreText={'Read more ▼'}
                      readLessText={'Read less ▲'}
                      readMoreClassName='font-bold'
                      readLessClassName='font-bold'
                    >
                      {Collection.description}
                    </ReactReadMoreReadLess>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className='mt-6 flex items-center gap-4'>
                {Collection?.type === 'product' &&
                  Collection?.is_owner &&
                  Collection?.status != 'published' && (
                    <div
                      onClick={
                        Collection?.status === 'published'
                          ? null
                          : (e) => salesPageModal(e, 'product')
                      }
                      className='mint-button font-satoshi-bold cursor-pointer'
                    >
                      <span>Sales Setting</span>
                    </div>
                  )}
                {Collection?.status !== 'published' && Collection?.is_owner && (
                  <Link
                    // onClick={handlePublishModal}
                    href={`/nft/publish/preview/${collectionId}`}
                    className='contained-button font-satoshi-bold'
                  >
                    Publish
                  </Link>
                )}
                {Collection?.is_owner && (
                  <Link
                    href={`/collection/create/?id=${collectionId}`}
                    className='outlined-button font-satoshi-bold'
                  >
                    <span>Edit</span>
                  </Link>
                )}
              </div>
              <div className='flex items-center mt-3'>
                {Collection &&
                  Collection.members &&
                  Collection.members.length > 0 &&
                  Collection.members.map((img, index) => (
                    <div key={index}>
                      {index < 5 && (
                        <Image
                          key={`member-img-${index}`}
                          className='rounded-full h-[35px] w-[38px] -ml-1 border-2 object-cover  border-white'
                          src={img?.avatar ? img.avatar : avatar}
                          alt=''
                          width={38}
                          height={35}
                        />
                      )}
                    </div>
                  ))}
                {Collection &&
                  Collection.members &&
                  Collection.members.length > 5 && (
                    <span className='ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  '>
                      +{Collection.members.length - 5}
                    </span>
                  )}
              </div>
            </div>

            <div className='flex items-start md:items-end flex-col mt-3 justify-center md:justify-end md:w-1/3  md:mt-0'>
              <div className='gray-linear-gradient-card-bg  ml-0 md:ml-3 rounded-md p-3 px-5 relative w-[330px]'>
                <div className='flex'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>
                    Net Worth{' '}
                    <i
                      onClick={getCollectionNewWorth}
                      className={`fa-regular fa-arrows-rotate text-textSubtle text-sm ${
                        balanceLoading ? 'fa-spin' : ''
                      } cursor-pointer`}
                    ></i>
                  </p>
                  <div className='ml-auto'>
                    <p className='pb-0 text-black font-black text-[16px] md:text-[20px] '>
                      {newWorth?.balance} {newWorth?.currency?.toUpperCase()}
                    </p>
                    <p className='text-sm  mt-0 text-textSubtle'>
                      (${newWorth?.balanceUSD?.toFixed(2)})
                    </p>
                  </div>
                </div>
                <div className='text-[12px] text-textSubtle text-right'>
                  Powered by{' '}
                  <a
                    href='https://www.coingecko.com/'
                    target='_blank'
                    rel='noreferrer'
                    className='text-primary-900'
                  >
                    CoinGecko
                  </a>
                </div>
                {Collection?.is_owner && (
                  <div className='flex items-center justify-between'>
                    <p className=' text-textSubtle mt-1 text-[14px]'>
                      Withdrawal{' '}
                    </p>
                    <button
                      onClick={handleWithdrawModel}
                      disabled={newWorth?.balance === 0}
                      className='mt-2 border-[1px] rounded-[4px] border-primary-900 py-1 px-2 bg-primary-900/[0.08] w-fit text-[12px] text-primary-900 font-bold'
                    >
                      Withdraw Funds
                    </button>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>Items </p>
                  <p className=' text-textSubtle mt-1 text-[14px] font-black text-black'>
                    {NFTs?.length ? NFTs.length : 0}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>
                    Contract Address{' '}
                  </p>
                  <p className=' text-textSubtle mt-1 text-[14px] font-black text-black'>
                    {Collection?.contract_address
                      ? walletAddressTruncate(Collection.contract_address)
                      : 'Not released'}
                    {Collection?.contract_address ? (
                      <i
                        className={`fa-solid fa-copy ml-2 ${
                          Collection?.contract_address
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed'
                        }`}
                        disabled={!Collection?.contract_address}
                        onClick={() =>
                          copyToClipboard(Collection?.contract_address)
                        }
                      ></i>
                    ) : null}
                    <span id='copied-message' className='hidden ml-2'>
                      Copied !
                    </span>
                  </p>
                </div>
                {Collection?.status === 'published' &&
                  Collection?.token_standard &&
                  Collection?.type === 'auto' && (
                    <div className='flex items-center justify-between mt-1'>
                      <p className=' text-textSubtle  text-[14px]'>
                        Token Standard
                      </p>
                      <small className='text-secondary-900 font-black rounded-2xl border border-secondary-900 px-3 py-1'>
                        {Collection?.token_standard}
                      </small>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
        <section>
          <section>
            <div className='mb-4'>
              <ul
                className='flex flex-wrap -mb-px text-sm font-medium text-center'
                id='myTab'
                data-tabs-toggle='#myTabContent'
                role='tablist'
              >
                <li
                  className='mr-2'
                  role='presentation'
                  onClick={() => setSelectedTab(1)}
                >
                  <button
                    className={`inline-block p-4 text-lg rounded-t-lg ${
                      selectedTab === 1
                        ? 'border-b-2 border-primary-900 text-primary-900'
                        : 'border-transparent text-textSubtle'
                    } hover:text-primary-600`}
                    id='nft'
                    data-tabs-target='#nft'
                    type='button'
                    role='tab'
                    aria-controls='nft'
                    aria-selected='true'
                  >
                    NFT
                  </button>
                </li>
                {Collection?.is_owner && (
                  <>
                    {(royalitySplitterId ||
                      (Collection?.status !== 'published' &&
                        !royalitySplitterId)) && (
                      <li
                        className='mr-2'
                        role='presentation'
                        onClick={() => setSelectedTab(2)}
                      >
                        <button
                          className={`inline-block p-4 text-lg rounded-t-lg ${
                            selectedTab === 2
                              ? 'border-b-2 border-primary-900 text-primary-900'
                              : 'border-transparent text-textSubtle'
                          } hover:text-primary-900`}
                          id='dashboard'
                          data-tabs-target='#dashboard'
                          type='button'
                          role='tab'
                          aria-controls='dashboard'
                          aria-selected='false'
                        >
                          Royalty Splitter
                        </button>
                      </li>
                    )}
                  </>
                )}
                {Collection?.is_owner && (
                  <li
                    className='mr-2'
                    role='presentation'
                    onClick={() => setSelectedTab(3)}
                  >
                    <button
                      className={`inline-block p-4 text-lg rounded-t-lg ${
                        selectedTab === 3
                          ? 'border-b-2 border-primary-900 text-primary-900'
                          : 'border-transparent text-textSubtle'
                      } hover:text-primary-900`}
                      id='nft-sale'
                      data-tabs-target='#nft-sale'
                      type='button'
                      role='tab'
                      aria-controls='nft-sale'
                      aria-selected='false'
                    >
                      NFT Sales
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div id='myTabContent'>
              {selectedTab === 1 && (
                <div className='mt-6 mb-6 md:mb-[100px]'>
                  <NFTTab
                    Collection={Collection}
                    NFTs={NFTs}
                    onShowSalesPageModal={(salesInfo) =>
                      onShowSalesPageModal(salesInfo)
                    }
                    onNFTSort={(data) => onNFTSort(data)}
                    nftListSortBy={nftListSortBy}
                  />
                </div>
              )}
              {selectedTab === 2 && (
                <div className='mb-6 md:mb-[100px]'>
                  <div className='bg-white rounded-[12px] p-5 shadow-main'>
                    {!createNewSplitter && !isSplitterAdded ? (
                      <div>
                        <div className='flex justify-center flex-col'>
                          <label htmlFor='splitter-selector'>
                            Select Splitter
                          </label>
                          <div className='flex items-center'>
                            <div className='flex'>
                              {typeof window !== 'undefined' && (
                                <Select
                                  defaultValue={splitter}
                                  onChange={setSplitter}
                                  onKeyDown={(event) =>
                                    onSplitterSearch(event.target.value)
                                  }
                                  options={options}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  menuPortalTarget={document.body}
                                  placeholder='Select Splitter'
                                  isLoading={isSplitterLoading}
                                  noOptionsMessage={() => 'No Splitter Found'}
                                  loadingMessage={() =>
                                    'Loading,please wait...'
                                  }
                                  getOptionLabel={(option) =>
                                    `${option.name ? option.name : option.id}`
                                  }
                                  classNamePrefix='splitter-select'
                                  isClearable
                                  isSearchable
                                  menuShouldScrollIntoView
                                  onMenuScrollToBottom={() => scrolledBottom()}
                                  splitterKey={splitterKey}
                                />
                              )}
                              <button
                                onClick={handleSelectedSplitter}
                                className='bg-primary-100 text-primary-900 text-md ml-2 px-5 py-2 rounded w-[100px]'
                              >
                                {addSplitterLoading ? (
                                  <Spinner forButton={true} />
                                ) : (
                                  'Apply'
                                )}
                              </button>
                            </div>
                            <p className='mx-5 p-0'>or</p>
                            <button
                              className='bg-primary-100 text-primary-900 text-md px-5 py-2 rounded'
                              onClick={() => setCreateNewSplitter(true)}
                            >
                              Create New
                            </button>
                          </div>
                        </div>
                        {applySplitterSubmitted && !splitter && (
                          <p className='text-red-400 text-sm'>
                            Please select a splitter to apply
                          </p>
                        )}
                      </div>
                    ) : null}{' '}
                    {createNewSplitter || isSplitterAdded ? (
                      <div className='mb-8'>
                        <div className='flex items-center mb-8'>
                          <div className='w-2/4 mr-1 relative'>
                            <label htmlFor='splitterName'>Splitter Name</label>
                            <input
                              id='splitterName'
                              name='splitterName'
                              value={splitterName}
                              disabled={hasPublishedRoyaltySplitter}
                              className='mt-1 rounded-[3px]'
                              style={{ height: 42 }}
                              type='text'
                              onChange={(e) => setSplitterName(e.target.value)}
                              placeholder='Splitter Name'
                            />
                            {((isSplitterSubmitted && !splitterName) ||
                              (!blockchain && isPublishing)) && (
                              <p className='text-sm text-red-400 absolute'>
                                Name is required
                              </p>
                            )}
                          </div>
                          <div className='w-2/4 ml-1 relative'>
                            <label htmlFor='blockchain'>Blockchain</label>
                            <select
                              value={blockchain}
                              onChange={(e) => setBlockchain(e.target.value)}
                              disabled={hasPublishedRoyaltySplitter}
                              className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
                            >
                              <option value={''} defaultValue>
                                Select Blockchain
                              </option>
                              {validNetworks.map((network) => (
                                <option
                                  value={network?.network}
                                  key={network?.network}
                                >
                                  {network?.networkName}
                                </option>
                              ))}
                            </select>
                            {((isSplitterSubmitted && !blockchain) ||
                              (isPublishing && !blockchain)) && (
                              <p className='text-sm text-red-400 absolute'>
                                Blockchain is required
                              </p>
                            )}
                          </div>
                        </div>
                        {hasPublishedRoyaltySplitter ? (
                          <div className='flex items-center mb-6'>
                            <p className='text-sm'>
                              Contract Address:{' '}
                              {walletAddressTruncate(splitterAddress)}{' '}
                            </p>
                            <CopyToClipboard text={splitterAddress}>
                              <button className='ml-1 w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer text-[#A3D7EF] active:text-black'>
                                <FontAwesomeIcon className='' icon={faCopy} />
                              </button>
                            </CopyToClipboard>
                          </div>
                        ) : null}
                        <div className='flex items-start md:items-center justify-between pb-5 mt-4 border-b-[1px] mb-2 border-[#E3DEEA]'>
                          <h3 className='text-[18px] font-black'>
                            Contributor
                          </h3>
                          {ShowPercentError ? (
                            <p className='text-red-400 text-[14px] mt-1'>
                              Total percent of contributors should equal to or
                              lesser than 100%
                            </p>
                          ) : null}
                          {/* {CollectionDetail?.is_owner && data?.members?.length ? ( */}
                          <div className='flex items-center justify-center flex-col md:flex-row'>
                            {!hasPublishedRoyaltySplitter && (
                              <>
                                <div className='form-check form-switch flex items-center'>
                                  <p className='text-[#303548] text-[12px] mr-3'>
                                    Split Evenly
                                  </p>
                                  <input
                                    className='form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                                    type='checkbox'
                                    checked={AutoAssign}
                                    role='switch'
                                    onChange={handleAutoAssign}
                                  />
                                </div>
                                {/* <div
                                  className='mint-button mt-4 md:mt-0 ml-4 text-center font-satoshi-bold w-full text-[12px] md:w-fit flex'
                                  onClick={() => setShowImportWallet(true)}
                                >
                                  <Image
                                    src={PlusIcon}
                                    alt='add'
                                    width={14}
                                    height={14}
                                  />
                                  <span className='ml-1'>
                                    Import Contributor
                                  </span>
                                </div> */}
                              </>
                            )}
                          </div>
                          {/* ) : null} */}
                        </div>{' '}
                        <MemberListTable
                          collection={Collection}
                          list={royalityMembers}
                          headers={TABLE_HEADERS}
                          // handlePublish={setShowPublish}
                          setIsEdit={setIsEdit}
                          setRoyalityMembers={setRoyalityMembers}
                          showRoyalityErrorModal={showRoyalityErrorModal}
                          isEdit={isEdit}
                          handleValueChange={handleValueChange}
                          handleAutoFill={handleAutoFill}
                          isOwner={Collection?.is_owner}
                          isPublished={hasPublishedRoyaltySplitter}
                        />
                        {isPublishing && !royalityMembers.length && (
                          <p className='text-red-400 text-sm mt-4'>
                            Please add members to publish
                          </p>
                        )}
                        <div className='w-full flex items-center justify-end gap-4 pb-10'>
                          {!hasPublishedRoyaltySplitter && (
                            <div>
                              <button
                                onClick={handleAutoFill}
                                className='border-primary-900 border text-primary-900 p-3 font-black text-[14px]'
                              >
                                Save draft
                              </button>
                            </div>
                          )}
                          {!hasPublishedRoyaltySplitter && (
                            <button
                              className='bg-primary-100 border border-primary-100 text-primary-900 p-3 font-black text-[14px]'
                              onClick={handlePublishSpliter}
                              disabled={
                                !canPublishRoyaltySplitter ||
                                isPublishingRoyaltySplitter
                              }
                            >
                              {isPublishingRoyaltySplitter
                                ? publishRoyaltySplitterStatus === 1
                                  ? 'Creating contract'
                                  : 'Publishing'
                                : 'Publish to Blockchain'}
                            </button>
                          )}

                          {Collection?.status !== 'published' ? (
                            <>
                              {royalitySplitterId && (
                                <div className='token-gated-dropdown relative'>
                                  <button className='flex transition duration-150 ease-in-out  border-primary-900 border text-primary-900 p-3 font-black text-[14px]'>
                                    &#xFE19;
                                  </button>
                                  <div className='opacity-0 text-[14px] visible token-gated-dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95'>
                                    <div className='absolute z-1 right-0 w-[120px]  origin-top-right mt-3 shadow  bg-white border outline-none'>
                                      <ul className='py-3  flex flex-col divide-y gap-4'>
                                        {Collection?.status !== 'published' && (
                                          <li
                                            className='cursor-pointer px-4'
                                            onClick={() => detachSplitter()}
                                          >
                                            <i className='fa-solid fa-link-slash mr-2'></i>
                                            Detach
                                          </li>
                                        )}
                                        {!hasPublishedRoyaltySplitter && (
                                          <li
                                            onClick={() => deleteSplitter()}
                                            className='cursor-pointer px-4 pt-3'
                                          >
                                            <i className='fa-solid fa-trash mr-2'></i>
                                            Delete
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {selectedTab === 3 && (
                <div className='mb-6  mb-6 md:mb-[100px]'>
                  <div className='bg-white rounded-[12px] p-5 mt-6 shadow-main'>
                    <NFTSales items={nftSales} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>
        {showSalesPageModal && (
          <SalesPageModal
            projectId={projectID}
            show={showSalesPageModal}
            address={Collection?.contract_address}
            collectionId={collectionId}
            collectionType={`${collectionType}`}
            nftId={nftId}
            collectionName={Collection?.name}
            handleClose={() => setShowSalesPageModal(false)}
            successClose={() => {
              setShowSalesPageModal(false);
              setShowSuccessModal(true);
              getCollectionDetail();
              getNFTs();
            }}
            supply={nftMemSupply}
            projectNetwork={collectionNetwork}
            setNFTShareURL={setNFTShareURL}
            setMembershipNFTId={setMembershipNFTId}
            salesSetupInfo={salesSetupInfo}
          />
        )}
        {showSuccessModal && (
          <SalesSuccessModal
            show={showSuccessModal}
            handleClose={() => {
              setShowSuccessModal(false);
            }}
            projectId={projectID}
            nftShareURL={nftShareURL}
            membershipNFTId={membershipNFTId}
            handlePublishModal={handlePublishModal}
          />
        )}

        {showPublishRoyaltySpliterConfirmModal && (
          <PublishRoyaltyConfirmModal
            show={showPublishRoyaltySpliterConfirmModal}
            handleClose={() => {
              setShowPublishRoyaltySpliterConfirmModal(false);
            }}
            publishProject={handlePublishRoyaltySplitter}
          />
        )}

        {showPublishRoyaltySpliterModal && (
          <PublishRoyaltyModal
            isVisible={showPublishRoyaltySpliterModal}
            isLoading={isPublishingRoyaltySplitter}
            status={publishRoyaltySplitterStatus}
            onRequestClose={() => {
              getCollectionDetail();
              setShowPublishRoyaltySpliterModal(false);
            }}
            contractAddress={contractAddress}
          />
        )}

        {showPublishRoyaltySpliterErrorModal && (
          <ErrorModal
            show={showPublishRoyaltySpliterErrorModal}
            title='Failed to publish royalty percentage!'
            handleClose={() => setShowPublishRoyaltySpliterErrorModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CollectionContent;
