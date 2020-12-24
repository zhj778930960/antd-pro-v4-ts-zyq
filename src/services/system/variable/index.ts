import request from '@/utils/request'
import { GetAllVariablesData, DeleteVariablesType, VariblesDataType} from './index.d'

export function getAll(params:GetAllVariablesData) {
  return request('/api/sys_config', {
    params
  })
}

export function delVariable(data: DeleteVariablesType) {
  return request('/api/sys_config/del', {
    method: 'delete',
    data
  })
}

export function addVariable(data: VariblesDataType) {
  return request('/api/sys_config/add', {
    method: 'post',
    data
  })
}

export function editVariable(data: VariblesDataType) {
  return request('/api/sys_config/edit', {
    method: 'put',
    data
  })
}
