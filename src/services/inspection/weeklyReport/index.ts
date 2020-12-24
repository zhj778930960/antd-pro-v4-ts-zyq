import request from '@/utils/request';
import { ReportsInspectionParams } from './index.d'

export function getReportsInspectionDatas(params: ReportsInspectionParams) {
  return request('/api/reports/inspection', {
    params
  })
}