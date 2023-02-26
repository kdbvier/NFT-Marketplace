import axios from 'axios';
import { client } from '../httpClient';

export async function getUserInfo(userID) {
  return await client('GET', `/user/${userID}`);
}
export async function getRoyalties(userID, page) {
  return await client('GET', `/user/royalty?page=${page}`);
}

export async function updateUserInfo(userID, payload) {
  return await client('PUT', `/user/${userID}`, payload, 'formdata');
}
export async function getUserBookmarkedProjectList(payload) {
  return await client(
    'GET',
    `/user/${payload.userID}/project/bookmark?page=${payload.page}&limit=${payload.limit}`
  );
}
export async function claimRoyalty(payload) {
  let formData = new FormData();
  formData.append('royalty_uid', payload.royalty_uid);
  if (payload.transaction_hash) {
    formData.append('transaction_hash', payload.transaction_hash);
  }
  return await client('POST', `/user/royalty/claim`, formData, 'formdata');
}

export async function sendMessage(payload) {
  let formData = new FormData();
  formData.append('noti_type', payload.type);
  formData.append('message', payload.message);
  formData.append('email', payload.email);
  return await client('POST', '/send-slack', formData, 'formdata');
}
export async function getUserRevenue(id) {
  return await client('GET', `/user/${id}/revenue`);
}
