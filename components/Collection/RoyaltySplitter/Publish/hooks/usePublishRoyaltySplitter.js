import { useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import * as collectionService from 'services/collection/collectionService';
import * as RoyaltySplitter from 'config/ABI/genericProxyFactory';
import useSendTransaction from './useSendTransaction';
import { NETWORKS } from 'config/networks';
import { ls_GetChainID } from 'util/ApplicationStorage';
import { event } from 'nextjs-google-analytics';
import Config from 'config/config';
import TagManager from 'react-gtm-module';

export default function usePublishRoyaltySplitter(payload = {}) {
  const {
    collection,
    splitters,
    onUpdateStatus = () => {},
    royaltySplitterId,
  } = payload;

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(1);
  const provider = useRef();
  const contract = useRef();
  const transaction = useRef();
  // Transaction result states
  const txReceipt = useRef();
  const listener = useRef();
  const { sendTransaction, waitTransactionResult } = useSendTransaction();

  let splitterId = collection?.royalty_splitter?.id
    ? collection.royalty_splitter.id
    : royaltySplitterId;

  const gaslessMode = Config.GASLESS_ENABLE;

  useEffect(() => {
    const init = async () => {
      provider.current = await getProvider();
      contract.current = RoyaltySplitter.createInstance(provider.current);
    };

    init();
  }, []);

  const getProvider = async () => {
    if (!window.ethereum) {
      throw new Error(`User wallet not found`);
    }

    await window.ethereum.enable();
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const userNetwork = await newProvider.getNetwork();
    return newProvider;
  };

  const canPublish = useMemo(() => {
    // if (collection == null) {
    //   return false;
    // }

    return collection?.royalty_splitter?.status !== 'published';
  }, [collection]);

  const callPublishApi = async () => {
    return await collectionService.publishRoyaltySplitter(splitterId);
  };

  const updateOffChainData = async () => {
    const payload = new FormData();
    payload.append('transaction_hash', txReceipt.current.transactionHash);
    payload.append('block_number', txReceipt.current.blockNumber);
    return collectionService.publishRoyaltySplitter(splitterId, payload);
  };

  const sendOnChainTransaction = async (data) => {
    const creator = await provider.current.getSigner().getAddress();
    let chainId = ls_GetChainID();
    let minimalForwarder = NETWORKS?.[chainId]?.forwarder;
    let masterRoyaltySplitter = NETWORKS?.[chainId]?.masterRoyaltySplitter;
    let discount = NETWORKS[Number(chainId)]?.discount;
    let treasury = NETWORKS[Number(chainId)]?.decirTreasury;
    const functionPayload = [
      {
        receivers: data?.config?.receivers?.map((spliter) => spliter.user_eoa),
        shares: data?.config?.receivers?.map((splitter) =>
          ethers.utils.parseUnits(splitter.royalty_percent.toString())
        ),
        collection: data?.config?.collection_address,
        masterCopy: masterRoyaltySplitter,
        creator,
        decirContract: treasury,
        discountContract: discount,
        forwarder: minimalForwarder,
      },
    ];

    return sendTransaction({
      contract: contract.current,
      functionName: 'createRoyaltyProxy',
      functionPayload,
    });
  };

  const runTransaction = async (data) => {
    const signer = await provider.current.getSigner();
    const creator = signer.getAddress();
    let chainId = ls_GetChainID();
    let minimalForwarder = NETWORKS?.[chainId]?.forwarder;
    let masterRoyaltySplitter = NETWORKS?.[chainId]?.masterRoyaltySplitter;
    let discount = NETWORKS[Number(chainId)]?.discount;
    let treasury = NETWORKS[Number(chainId)]?.decirTreasury;

    const functionPayload = {
      receivers: data?.config?.receivers?.map((spliter) => spliter.user_eoa),
      shares: data?.config?.receivers?.map((splitter) =>
        ethers.utils.parseUnits(splitter.royalty_percent.toString())
      ),
      collection: data?.config?.collection_address,
      masterCopy: masterRoyaltySplitter,
      creator,
      decirContract: treasury,
      discountContract: discount,
      forwarder: minimalForwarder,
    };
    console.log(functionPayload);
    const tx = await contract.current
      .connect(signer)
      .createRoyaltyProxy(functionPayload);
    const res = await tx.wait();

    return res;
  };

  const cleanUp = () => {
    contract.current.off('ProxyCreated', listener.current);
  };

  const publish = async () => {
    event('publish_royalty_splitter', { category: 'royalty_splitter' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'royalty_splitter',
        pageTitle: 'publish_royalty_splitter',
      },
    });

    try {
      // if (!canPublish) {
      //   return;
      // }
      setIsLoading(true);
      const publishData = await callPublishApi();

      if (gaslessMode === 'true') {
        transaction.current = await sendOnChainTransaction(publishData);
        txReceipt.current = await waitTransactionResult(transaction.current);
      } else {
        txReceipt.current = await runTransaction(publishData);
      }
      const publishResponse = await updateOffChainData();
      if (publishResponse.function.status === 'failed') {
        throw new Error(
          'Transaction failed. ' + publishResponse.function.message
        );
      }

      setStatus(2);
      onUpdateStatus(publishResponse.function.status);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setStatus(1);
      throw err;
    } finally {
      cleanUp();
    }
  };

  return {
    status,
    isLoading,
    canPublish,
    publish,
  };
}
