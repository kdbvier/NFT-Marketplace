import { client } from "../httpClient";
export async function getNftListByProjectId(payload) {
  return await client(
    "GET",
    `/nft?project_uuid=${payload.projectId}&page=${payload.page}&limit=${payload.perPage}`
  );
}

export async function saveNFT(payload) {
  return await client("POST", `/nft`, payload, "formdata");
}
