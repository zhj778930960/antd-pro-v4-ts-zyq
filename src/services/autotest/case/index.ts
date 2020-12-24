import request from '@/utils/request'
import { GetTestCaseParams, DelTestCases, CurrentRowParams } from './index.d'

export async function getAllTestCases(params: GetTestCaseParams) {
  return request('/api/test_case', {
    params
  })
}

export async function addTestCases(data: CurrentRowParams) {
  return request('/api/test_case/add', {
    method: 'post',
    data
  })
}

export async function syncTestCases() {
  return request('/api/test_case/sync')
}

export async function editTestCases(data: CurrentRowParams) {
  return request('/api/test_case/edit', {
    method: 'put',
    data
  })
}

export async function delTestCases(data: DelTestCases) {
  return request('/api/test_case/del', {
    method: 'delete',
    data
  })
}

