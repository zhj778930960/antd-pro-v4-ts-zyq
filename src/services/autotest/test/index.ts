import request from '@/utils/request';
import { GetTestChilrenCases, AddTestChilds, DelTestChilds, GetAllTestsParams } from './index.d'
// 获取服务器
export function getServerOptionData() {
  return request('/api/test/server_options');
}

export function getChildCases(params: GetTestChilrenCases) {
  return request('/api/test_content', {
    params
  })
}

export async function addChilrens(data: AddTestChilds[]) {
  return request('/api/test_content/add', {
    method: 'post',
    data
  })
}

export async function editChilrens(data: AddTestChilds) {
  return request('/api/test_content/update', {
    method: 'post',
    data
  })
}

export async function delChilrens(data: DelTestChilds) {
  return request('/api/test_content/del', {
    method: 'delete',
    data
  })
}

export function getAllTests(params: GetAllTestsParams) {
  return request('/api/test', {
    params
  })
}

export function delTests(data: DelTestChilds) {
  return request('/api/test/del', {
    method: 'delete',
    data
  })
}

export function copyTests(data: DelTestChilds) {
  return request('/api/test/copy', {
    method: 'post',
    data
  })
}

export function executeTests(data: DelTestChilds) {
  return request('/api/test/execute', {
    method: 'post',
    data
  })
}

export function getTestsLog(params: DelTestChilds) {
  return request('/api/test/log', {
    params
  })
}

export function getTestsDetails(params: DelTestChilds) {
  return request('/api/test/get', {
    params
  })
}
