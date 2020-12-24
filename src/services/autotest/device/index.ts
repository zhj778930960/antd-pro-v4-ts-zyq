import request from '@/utils/request';
import { GetDeviceListsParams, GetAutotestDevicesParams, AddOrEditDeviceParams, DelDeviceParams } from './index.d'
// 获取全部的设备列表
export function getDeviceLists(data: GetDeviceListsParams) {
  return request('/api/device/list', {
    method: 'post',
    data
  });
}

export function getAutotestDivices(params: GetAutotestDevicesParams) {
  return request('/api/device', {
    params
  });
}

export function addAutotestDivices(data: AddOrEditDeviceParams) {
  return request('/api/device/add', {
    method: 'post',
    data
  });
}

export function editAutotestDivices(data: AddOrEditDeviceParams) {
  return request('/api/device/edit', {
    method: 'put',
    data
  });
}

export function delAutotestDivices(data: DelDeviceParams) {
  return request('/api/device/del', {
    method: 'delete',
    data
  });
}