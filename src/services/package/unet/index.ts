import request from '@/utils/request';
import { GetAllUnetImagesPackages } from './index.d'

export function getAllUnetImagesPackages(params: GetAllUnetImagesPackages) {
  return request('/api/unet_images', {
    params
  })
}