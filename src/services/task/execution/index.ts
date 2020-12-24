import request from '@/utils/request';
import { GetAllExecutionsType, DelExecutionType, AddOrEditExecutionsType } from './index.d';

export function getAllExecutionList(params: GetAllExecutionsType) {
  return request('/api/task_inventory', {
    params,
  });
}

export function delExecution(data: DelExecutionType) {
  return request('/api/task_inventory/del', {
    method: 'delete',
    data,
  });
}

export function copyExecution(data: DelExecutionType) {
  return request('/api/task_inventory/copy', {
    method: 'post',
    data,
  });
}

export function executeExecution(data: DelExecutionType) {
  return request('/api/task_inventory/execute', {
    method: 'post',
    data,
  });
}

export function addExecution(data: AddOrEditExecutionsType) {
  return request('/api/task_inventory/add', {
    method: 'post',
    data,
  });
}

export function editExecution(data: AddOrEditExecutionsType) {
  return request('/api/task_inventory/edit', {
    method: 'put',
    data,
  });
}
