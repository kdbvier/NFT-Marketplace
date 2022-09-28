import { client } from "../httpClient";
export async function checkUniqueCollectionName(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("collection_name", payload.projectName);
  bodyFormData.append(`collection_uuid`, payload.project_uuid);
  return await client("POST", `/collection/validate`, bodyFormData);
}
export async function deleteAssetsOfCollection(payload) {
  return await client(
    "DELETE",
    `/collection/${payload.projectId}/asset/${payload.assetsId}`
  );
}

export async function checkUniqueCollectionSymbol(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("collection_symbol", payload.collectionSymbol);
  bodyFormData.append(`collection_uuid`, payload.project_uuid);
  return await client("POST", `/collection/validate`, bodyFormData);
}
export async function createCollection(payload) {
  const bodyFormData = new FormData();
  payload?.name && bodyFormData.append("name", payload?.name);
  bodyFormData.append("project_id", payload.dao_id);
  bodyFormData.append("collection_type", payload.collection_type);

  return await client("POST", `/collection`, bodyFormData);
}
export async function mockCreateCollection(payload) {
  const bodyFormData = new FormData();
  payload?.name && bodyFormData.append("name", payload?.name);
  bodyFormData.append("project_id", payload.dao_id);
  bodyFormData.append("collection_type", payload.collection_type);

  return await client("POST", `/collection`, bodyFormData);
}
export async function updateCollection(payload) {
  const bodyFormData = new FormData();
  if (payload.cover !== null) {
    bodyFormData.append("cover", payload.cover);
  }

  bodyFormData.append("name", payload.name);
  bodyFormData.append("description", payload.overview);
  bodyFormData.append("links", payload.webLinks);
  bodyFormData.append("category_id", payload.category_id);
  bodyFormData.append("blockchain", payload.blockchainCategory);
  // bodyFormData.append("primary_royalty", payload.primaryRoyalties);
  // bodyFormData.append("secondary_royalty", payload.secondaryRoyalties);
  if (payload.collectionSymbol) {
    bodyFormData.append("collection_symbol", payload.collectionSymbol);
  }
  if (payload.logo !== null) {
    bodyFormData.append("logo", payload.logo);
  }

  bodyFormData.append("freeze_metadata", payload.isMetaDaFreezed);
  bodyFormData.append("token_transferable", payload.isTokenTransferable);
  bodyFormData.append("royalty_percent", payload.royaltyPercentage);

  return await client("PUT", `/collection/${payload.id}`, bodyFormData);
}

export async function getCollectionDetailsById(payload) {
  return await client("GET", `/collection/${payload.id}`);
}

export async function getCollections(
  listType,
  projectId,
  page,
  limit,
  keyword = ""
) {
  return await client(
    "GET",
    `/collection?list_type=${listType}&project_id=${projectId}&page=${page}&limit=${limit}&keyword=${keyword}`
  );
}
export async function getUserCollections(payload) {
  return await client(
    "GET",
    `/collection?list_type=user&page=${payload.page}&limit=${payload.limit}`
  );
}

export async function getCollectionNFTs(id) {
  return await client("GET", `/collection/${id}/nft`);
}

export async function connectCollection(ranknftid, collectionId) {
  const bodyFormData = new FormData();
  bodyFormData.append("collection_id", collectionId);
  return await client(
    "POST",
    `/ranft/${ranknftid}/connect_collection`,
    bodyFormData
  );
}

export async function publishCollection(id) {
  return await client("PUT", `/collection/${id}/publish`, "formdata");
}

//Royality Splitters
export async function getSplitterDetails(id, type = "splitter_id") {
  return await client("GET", `/royalty?${type}=${id}`);
}

export async function updateRoyaltySplitter(payload) {
  return await client("PUT", `/royalty`, payload, "formdata");
}

export async function getCollectionSales(id) {
  return await client("GET", `/collection/${id}/sales`);
}
