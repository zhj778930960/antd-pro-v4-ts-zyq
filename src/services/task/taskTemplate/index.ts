import request from '@/utils/request';
import { GetAllTaskTemplatesType, DelOrCopyTaskTemplatesType, AddTaskTemplatesType, EditTaskTemplatesType } from './index.d';

export function getAllTaskTemplate(params: GetAllTaskTemplatesType) {
  return request('/api/task_template', {
    params,
  });
}

export function addTaskTemplates(data: AddTaskTemplatesType) {
  return request('/api/task_template/add', {
    method: 'post',
    data,
  });
}

export function editTaskTemplates(data: EditTaskTemplatesType) {
  return request('/api/task_template/edit', {
    method: 'put',
    data,
  });
}

export function delTaskTemplates(data: DelOrCopyTaskTemplatesType) {
  return request('/api/task_template/del', {
    method: 'delete',
    data,
  });
}

export function copyTaskTemplates(data: DelOrCopyTaskTemplatesType) {
  return request('/api/task_template/copy', {
    method: 'post',
    data,
  });
}
