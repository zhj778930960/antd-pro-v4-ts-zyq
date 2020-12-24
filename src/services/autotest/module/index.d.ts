export interface GetTestModuleParams {
  page?: number,
  size?: number,
  sort?: string | string[],
  enabled?: boolean,
  list_style?: string,
  parent_id?: string
}


export interface TestModuleDataType {
  name?: string,
  id?: string,
  enabled?: boolean,
  case_id?: string | string[]
  [key: string]: any
}

export interface AddTestMouleCases {
  item_id?: string,
  sort?: number,
  module_id?: string
}

export interface AddTestModule {
  enabled?: boolean,
  id?: string
  name?: string,
  parent_id?: string,
  sort?: number
}

export interface DelTestModule {
  id?: string[]
}
