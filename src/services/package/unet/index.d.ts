export interface GetAllUnetImagesPackages {
  page?: number,
  per_page?: number,
  [key: string]: any
}

export interface TableColumnsParams {
  branch: string,
  build_type: string,
  created_at: number,
  hashes: string,
  id: number,
  jenkins: string,
  log_url: string,
  server: string,
  version_code: string
}