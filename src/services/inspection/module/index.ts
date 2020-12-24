import request from '@/utils/request'
import { GetInspectionModuleParams, AddInspectionMouleItems, AddInspectionModule, DelInspectionModule, SuperiorInspection } from './index.d'

export async function getAllInspectionModules(params: GetInspectionModuleParams) {
  return request('/api/inspection_module', {
    params
  })
}

export async function addInspectionModules(data: AddInspectionModule) {
  return request('/api/inspection_module/add', {
    method: 'post',
    data
  })
}

export async function editInspectionModules(data: AddInspectionModule) {
  return request('/api/inspection_module/edit', {
    method: 'put',
    data
  })
}

export async function delInspectionModules(data: DelInspectionModule) {
  return request('/api/inspection_module/del', {
    method: 'delete',
    data
  })
}

export async function superiorInspectionModules(params: SuperiorInspection) {
  return request('/api/inspection_module/superior', {
    params
  })
}

export async function getAllInspectionModuleItems(params: GetInspectionModuleParams) {
  return request('/api/inspection_module_item', {
    params
  })
}

export async function addInspectionModuleItems(data: AddInspectionMouleItems) {
  return request('/api/inspection_module_item/add', {
    method: 'post',
    data
  })
}

export async function editInspectionModuleItems(data: AddInspectionMouleItems) {
  return request('/api/inspection_module_item/edit', {
    method: 'put',
    data
  })
}

export async function delInspectionModuleItems(data: DelInspectionModule) {
  return request('/api/inspection_module_item/del', {
    method: 'delete',
    data
  })
}
