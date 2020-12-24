import request from '@/utils/request';
import { GetAllResourcesAssetPackages } from './index.d'

export function getAllResourcesAssetPackages(params: GetAllResourcesAssetPackages) {
  return request('/api/asset_packages', {
    params
  })
}

export function getOneResourcesAssetPackages(id: string) {
  return request(`/api/asset_packages/${id}`)
}