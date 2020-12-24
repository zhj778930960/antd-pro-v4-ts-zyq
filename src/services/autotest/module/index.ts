import request from '@/utils/request'
import { GetTestModuleParams, AddTestMouleCases, AddTestModule, DelTestModule } from './index.d'

export async function getAllTestModules(params: GetTestModuleParams) {
  return request('/api/test_module', {
    params
  })
}


export async function addTestModules(data: AddTestModule) {
  return request('/api/test_module/add', {
    method: 'post',
    data
  })
}

export async function editTestModules(data: AddTestModule) {
  return request('/api/test_module/edit', {
    method: 'put',
    data
  })
}

export async function delTestModules(data: DelTestModule) {
  return request('/api/test_module/del', {
    method: 'delete',
    data
  })
}

export async function getAllTestModuleCases(params: GetTestModuleParams) {
  return request('/api/test_module_case', {
    params
  })
}

export async function addTestModuleCases(data: AddTestMouleCases) {
  return request('/api/test_module_case/add', {
    method: 'post',
    data
  })
}

export async function editTestModuleCases(data: AddTestMouleCases) {
  return request('/api/test_module_case/edit', {
    method: 'put',
    data
  })
}

export async function delTestModuleCases(data: DelTestModule) {
  return request('/api/test_module_case/del', {
    method: 'delete',
    data
  })
}