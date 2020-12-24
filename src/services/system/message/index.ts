import request from '@/utils/request'
import {GetAllMessagesParams} from './index.d'

export function getAllMessage(params: GetAllMessagesParams) {
  return request('/api/message', {
    params
  })
}