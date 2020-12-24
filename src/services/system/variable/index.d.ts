export interface GetAllVariablesData {
  page?: number,
  size?: number,
  sort?: string,
  variable?: string
}

export interface VariblesDataType {
  description?: string
  enabled?: number
  id?: string
  sort?: number
  updated_time?: string
  value?: string
  variable?: string
}

export interface DeleteVariablesType {
  id: string
}
