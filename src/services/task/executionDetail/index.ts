import request from '@/utils/request';
import { GelAllExecutionTaskParams, DelExecutionTaskParams, AddExecutionParams } from './index.d';

export function getAllExecutionTask(params: GelAllExecutionTaskParams) {
  return request('/api/task', {
    params,
  });
}

export function delExecutionTask(data: DelExecutionTaskParams) {
  return request('/api/task/del', {
    method: 'delete',
    data
  });
}

export function addExecutionTask(data: AddExecutionParams) {
  return request('/api/task/add', {
    method: 'post',
    data
  });
}

export function editExecutionTask(data: AddExecutionParams) {
  return request('/api/task/edit', {
    method: 'put',
    data
  });
}

export function getOneDetail(params: DelExecutionTaskParams) {
  return request('/api/task/get', {
    params
  });
}

export function getTaskLogs(params: DelExecutionTaskParams) {
  return request('/api/task/log', {
    params
  });
}



