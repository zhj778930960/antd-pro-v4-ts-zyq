import request from '@/utils/request';
import { GetAllInstallationPackages } from './index.d'

export function getAllInstallationPackages(params: GetAllInstallationPackages) {
  return request('/api/packages', {
    params
  })
}

export function getOneInstallationPackages(id: string) {
  return request(`/api/packages/${id}`)
}