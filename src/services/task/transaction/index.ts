import request from '@/utils/request';
import { GetTransactionsParams, AddTransactionsParams } from './index.d'

export function getTransactions(params: GetTransactionsParams) {
  return request('/api/transaction', {
    params
  })
}

export function addTransactions(data: AddTransactionsParams) {
  return request('/api/transaction/add', {
    method: 'post',
    data
  })
}

export function editTransactions(data: AddTransactionsParams) {
  return request('/api/transaction/edit', {
    method: 'put',
    data
  })
}

