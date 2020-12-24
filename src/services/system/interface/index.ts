import request from '@/utils/request'
import { GetAllInterfaces, EnableWathchBtn, WathchListParms } from './index.d'

export function getAllInterfaces(params: GetAllInterfaces) {
  return request('/api/api_log', {
    params
  })
}

export function getWathchButtonStatus() {
  return request('/api/api_log/monitor')
}

export function enabledWatchBtn(data: EnableWathchBtn) {
  return request('/api/api_log/monitor', {
    method: 'post',
    data
  })
}

export function getWatchListNames() {
  return request('/api/api_log/monitor_list')
}

export function setWatchListNames(data: WathchListParms) {
  return request('/api/api_log/monitor_list', {
    method: 'post',
    data
  })
}


export function clearUpInterfaceLogs() {
  return request('/api/api_log/del_all', {
    method: 'post'
  })
}