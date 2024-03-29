import { client } from '../httpClient';

export async function getUserNotifications(isActive = 1) {
  return await client(
    'GET',
    `/user/notifications?order_by=newer&page=${isActive}&per_page=15`
  );
}

export async function markAllNotificationAsRead(notificationList) {
  const request = new FormData();
  request.append('notifications', notificationList);
  return await client('PUT', `/user/notifications`, request, 'formdata');
}

export async function markNotificationAsRead(uuid) {
  const request = new FormData();
  request.append('read', 'true');
  return await client(
    'PUT',
    `/user/notifications/${uuid}`,
    request,
    'formdata'
  );
}
export async function getAsset(fuuid) {
  return await client('GET', `/asset?job_id=${fuuid}`);
}
