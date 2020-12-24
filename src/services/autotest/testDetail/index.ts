import request from '@/utils/request';

// 下载
export function getDownloadFile(url: string) {
  return request(`${url}`, {
    responseType: 'blob'
  });
}

