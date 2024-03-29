import { client } from '../httpClient';
export async function getNftListByProjectId(payload) {
  return await client(
    'GET',
    `/nft?project_uuid=${payload.projectId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function getNftListByUserId(payload) {
  return await client(
    'GET',
    `/nft?user_uid=${payload.userId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function saveNFT(payload) {
  return await client('POST', `/nft`, payload, 'formdata');
}
export async function createMembershipNft(payload) {
  return await client('POST', `/membership-nft`, payload, 'formdata');
}
export async function createNft(payload) {
  return await client('POST', `/lnft`, payload, 'formdata');
}

export async function generateUploadkey(payload) {
  return await client('POST', `/upload/genKey`, payload, 'formdata');
}

export async function generateUploadkeyGcp(payload) {
  return await client('POST', `/upload/signKey`, payload, 'formdata');
}

export async function getDefinedProperties() {
  return await client('GET', `/meta/category`);
}

export async function getNftDetails(type, id) {
  let typeValue =
    type === 'membership'
      ? '/membership-nft/'
      : type === 'product'
      ? '/product-nft/'
      : '/lnft/';
  return await client('GET', `${typeValue}${id}`);
}

export async function getNftDetailsAutoType(id) {
  return await client('GET', `/lnft/${id}`);
}

export async function getMintedNftDetails(nftId, tokenId) {
  return await client('GET', `/lnft/${nftId}/${tokenId}`);
}
export async function saveRightAttachedNFT(payload) {
  return await client('POST', `/ranft`, payload, 'formdata');
}

export async function getRightAttachedNFT(id) {
  return await client('GET', `/ranft/${id}`);
}

export async function saveProductNFT(payload) {
  return await client('POST', `/product-nft`, payload, 'formdata');
}

export async function updateProductNFT(id, payload) {
  return await client('PUT', `/product-nft/${id}`, payload, 'formdata');
}
export async function updateMembershipNFT(id, payload) {
  return await client('PUT', `/membership-nft/${id}`, payload, 'formdata');
}
export async function updateNft(id, payload) {
  return await client('PUT', `/lnft/${id}`, payload, 'formdata');
}

export async function setSalesPage(
  collectionType,
  collectionId,
  payload,
  nftId
) {
  return await client(
    'PUT',
    `/${
      collectionType === 'product' ? 'product-nft/collection' : 'membership-nft'
    }/${collectionType === 'product' ? collectionId : nftId}/sale`,
    payload,
    'formdata'
  );
}

export async function getassetDetails(id) {
  return await client('GET', `/asset?job_id=${id}`);
}

export async function updateRoyalty(id, payload) {
  return await client('PUT', `/ranft/${id}/royalty`, payload, 'formdata');
}

export async function getIdbyCode(id) {
  return await client('GET', `/ranft/invitation?invitation_code=${id}`);
}

export async function mintRANFT(id) {
  return await client('POST', `/ranft/${id}/mint`);
}
export async function mintProductOrMembershipNft(payload) {
  const url =
    payload.type === 'membership'
      ? '/membership-nft'
      : payload.type === 'product'
      ? '/product-nft'
      : '/lnft';
  return await client(
    'POST',
    `${url}/${payload.id}/mint`,
    payload.data,
    'formdata'
  );
}
export async function getMintedNftListByUserId(payload) {
  return await client(
    'GET',
    `/user/${payload.userId}/nft?page=${payload.page}&limit=${
      payload.limit
    }&keyword=${payload.keyword ? payload.keyword : ''}&order_by=${
      payload.order_by ? payload.order_by : ''
    }`
  );
}

export async function refreshNFT(payload) {
  let formData = new FormData();
  formData.append('tokenId', payload.tokenId);
  if (payload.tnxHash) {
    formData.append('transaction_hash', payload.tnxHash);
  }
  return await client(
    'POST',
    `/lnft/${payload.id}/refresh`,
    formData,
    'formdata'
  );
}
export async function deleteDraftNFT(id) {
  return await client('DELETE', `/lnft/${id}`);
}
export const NFTRegisterAfterPublish = async (nftId, tnx) => {
  let formData = new FormData();
  formData.append('txn_hash', tnx);

  return await client(
    'PUT',
    `/lnft/${nftId}/register-after-publish`,
    formData,
    'formdata'
  );
};

export async function moveToIPFS(data) {
  return await client('POST', `/lnft/move-to-ipfs`, data, 'formdata');
}
