import request from '@/utils/request';
import { GetAllRolesType, RoleDataType } from './index.d';

export async function getAll(params?: GetAllRolesType) {
  return request('/api/roles', {
    params,
  });
}

export async function add(data: RoleDataType) {
  return request('/api/roles', {
    method: 'post',
    data,
  });
}

export async function edit(data: RoleDataType, id?: number) {
  return request(`/api/roles/${id}`, {
    method: 'put',
    data,
  });
}

export async function del(id?: number) {
  return request(`/api/roles/${id}`, {
    method: 'delete',
  });
}
