import request from '@/utils/request'
import { GetDictionayParams, AddDictionaryParams, DelDictionaryParams, DictionaryDataType, AddDictChildParams } from './index.d'

// 获取字典列表
export function getAll(params: GetDictionayParams) {
  return request('/api/dictionary', {
    params
  })
}


// 新增字典列表
export function add(data:AddDictionaryParams) {
  return request('/api/dictionary/add', {
    method: 'post',
    data
  })
}

// 删除字典
export function del(data: DelDictionaryParams) {
  return request('/api/dictionary/del', {
    method: 'delete',
    data
  })
}

// 编辑字典
export function edit(data: DictionaryDataType) {
  return request('/api/dictionary/edit', {
    method: 'put',
    data
  })
}



// 获取字典项列表
export function getAllChildren(params: GetDictionayParams) {
  return request('/api/dictionary_detail', {
    params
  })
}


// 新增字典项
export function addChild(data: AddDictChildParams) {
  return request('/api/dictionary_detail/add', {
    method: 'post',
    data
  })
}

// 删除字典项
export function delChild(data: DelDictionaryParams) {
  return request('/api/dictionary_detail/del', {
    method: 'delete',
    data
  })
}

// 编辑字典项
export function editChild(data: AddDictChildParams) {
  return request('/api/dictionary_detail/edit', {
    method: 'put',
    data
  })
}

