import request from '@/utils/request'
import { UsersParamsType, CreateFormColumn, UserDelType, EditFormColumn } from './index.d'

export async function getUsers(params?: UsersParamsType) {  
  return request('/api/user', {
    params
  })
}

// 编辑用户
export async function editUser(params:EditFormColumn) {
  return  request('/api/user/edit', {
    method: 'PUT',
    data: params
  })
}

// 新增用户

export async function createUser(params:CreateFormColumn) {
  return  request('/api/user/add', {
    method: 'POST',
    data: params
  })
}

// 删除用户

export async function delUser(params: UserDelType) {
  return  request('/api/user/del', {
    method: 'DELETE',
    data: params
  })
}