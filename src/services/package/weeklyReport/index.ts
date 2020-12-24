import request from '@/utils/request';
import { ReportsBuildParams } from './index.d'

export function getReportsBuildDatas(params: ReportsBuildParams) {
  return request('/api/reports/build', {
    params
  })
}