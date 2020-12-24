export interface GetInspectionModuleParams {
  page?: number,
  size?: number,
  sort?: string | string[],
  enabled?: boolean,
  list_style?: string,
  parent_id?: string
}

export interface InspectionModuleDataType {
  name?: string,
  id: string,
  description?: string,
  [key: string]: any
}

export interface AddInspectionMouleItems {
  item_id?: string,
  sort?: number,
  module_id?: string
}

export interface AddInspectionModule {
  enabled?: number,
  id?: string
  name?: string,
  parent_id?: string,
  sort?: number
}

export interface DelInspectionModule {
  id?: string[]
}

export interface SuperiorInspection {
  id: string
}

