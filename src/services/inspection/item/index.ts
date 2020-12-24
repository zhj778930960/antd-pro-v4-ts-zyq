import request from '@/utils/request'
import { GetInspectionItemParams, AddInspecntionItem, DelInspectionItem } from './index.d'

export async function getAllInspectionItems(params: GetInspectionItemParams) {
  return request('/api/inspection_item', {
    params
  })
}

export async function addInspectionItems(data: AddInspecntionItem) {
  return request('/api/inspection_item/add', {
    method: 'post',
    data
  })
}

export async function editInspectionItems(data: AddInspecntionItem) {
  return request('/api/inspection_item/edit', {
    method: 'put',
    data
  })
}

export async function delInspectionItems(data: DelInspectionItem) {
  return request('/api/inspection_item/del', {
    method: 'delete',
    data
  })
}

