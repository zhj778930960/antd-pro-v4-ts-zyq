export interface GetAllResourcesAssetPackages {
  page?: number,
  per_page?: number,
  [key: string]: any
}

export interface TableColumnsParams {
  author: string,
  build_type: string,
  created_at: number,
  download_url: string,
  duration: number,
  id: number,
  jenkins: string,
  log_url: string,
  name: string,
  platform: string,
  version: number
}