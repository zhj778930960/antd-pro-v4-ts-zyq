import request from '@/utils/request';
import {
  GetAllInspectionType,
  GetInspectionChilrenItems,
  AddInspectionChilds,
  DelInspectionChilds,
  AddOrEditInspection,
  DelOrCopyOrExcuteParams,
  NotifyEwechatParams,
} from './index.d';

export async function getAll(params: GetAllInspectionType) {
  return request('/api/inspection', {
    params,
  });
}

export function addInspection(data: AddOrEditInspection) {
  return request('/api/inspection/add', {
    method: 'post',
    data,
  });
}

export function editInspection(data: AddOrEditInspection) {
  return request('/api/inspection/edit', {
    method: 'put',
    data,
  });
}

export function delInspection(data: DelOrCopyOrExcuteParams) {
  return request('/api/inspection/del', {
    method: 'delete',
    data,
  });
}

export function copyInspection(data: DelOrCopyOrExcuteParams) {
  return request('/api/inspection/copy', {
    method: 'post',
    data,
  });
}

export function executeInspection(data: DelOrCopyOrExcuteParams) {
  return request('/api/inspection/execute', {
    method: 'post',
    data,
  });
}

export async function getItemsDetails(params: GetInspectionChilrenItems) {
  return request('/api/inspection/get', {
    params,
  });
}

export async function getChilrenItems(params: GetInspectionChilrenItems) {
  return request('/api/inspection_content', {
    params,
  });
}

export async function getChilrenItemsLog(params: GetInspectionChilrenItems) {
  return request('/api/inspection_content/log', {
    params,
  });
}

export async function getChilrenItemsDetail(params: GetInspectionChilrenItems) {
  return request('/api/inspection_content/get', {
    params,
  });
}

export async function addChilrens(data: AddInspectionChilds[]) {
  return request('/api/inspection_content/add', {
    method: 'post',
    data,
  });
}

export async function editChilrens(data: AddInspectionChilds) {
  return request('/api/inspection_content/update', {
    method: 'post',
    data,
  });
}

export async function delChilrens(data: DelInspectionChilds) {
  return request('/api/inspection_content/del', {
    method: 'delete',
    data,
  });
}

export async function getInspectionDetailCode(url: string) {
  return request(`${url}`);
}

export async function notifyEwechat(data: NotifyEwechatParams) {
  return request('/api/message_sending/notify_ewechat', {
    method: 'post',
    data,
  });
}
