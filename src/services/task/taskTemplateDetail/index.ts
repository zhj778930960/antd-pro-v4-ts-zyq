import request from '@/utils/request'
import { GetAllTaskTemplateTask, AddTaskTemplateTaskParams, AddTaskTemTaskChilds, DelTaskTemplateTaskParams } from './index.d'

export function getAllTaskTemplateTasks(params: GetAllTaskTemplateTask) {
  return request('/api/task_template_task', {
    params
  })
}

export function addTaskTemplateTasks(data: AddTaskTemplateTaskParams) {
  return request('/api/task_template_task/add', {
    method: 'post',
    data
  })
}

export function editTaskTemplateTasks(data: AddTaskTemplateTaskParams) {
  return request('/api/task_template_task/edit', {
    method: 'put',
    data
  });
}

export function delTaskTemplateTasks(data: DelTaskTemplateTaskParams) {
  return request('/api/task_template_task/del', {
    method: 'delete',
    data
  });
}

export async function getTaskTemplateTaskChilrenItems(params: GetAllTaskTemplateTask) {
  return request('/api/task_template_task_content', {
    params
  })
}

export async function addTaskTemTaskChilrens(data: AddTaskTemTaskChilds[]) {
  return request('/api/task_template_task_content/add', {
    method: 'post',
    data
  })
}

export async function editTaskTemTaskChilrens(data: AddTaskTemTaskChilds) {
  return request('/api/task_template_task_content/update', {
    method: 'post',
    data
  })
}