import request from '@/utils/request'
import { GetAllEventMonitorings, AddEventMonitorings, OneIdEventMonitoring } from './index.d'

export function getAllEventMonitorings(params: GetAllEventMonitorings) {
  return request('/api/event', {
    params
  })
}

export function addEventMonitorings(data: AddEventMonitorings) {
  return request('/api/event/add', {
    method: 'post',
    data
  })
}


export function editEventMonitorings(data: AddEventMonitorings) {
  return request('/api/event/edit', {
    method: 'put',
    data
  })
}


export function unbindHookEventMonitorings(data: OneIdEventMonitoring) {
  return request('/api/event/unbind_hook', {
    method: 'post',
    data
  })
}

export function bindHookEventMonitorings(data: OneIdEventMonitoring) {
  return request('/api/event/bind_hook', {
    method: 'post',
    data
  })
}

export function refreshHookEventMonitorings(data: OneIdEventMonitoring) {
  return request('/api/event/refresh_hook', {
    method: 'post',
    data
  })
}
export function delEventMonitorings(data: OneIdEventMonitoring) {
  return request('/api/event/del', {
    method: 'delete',
    data
  })
}
