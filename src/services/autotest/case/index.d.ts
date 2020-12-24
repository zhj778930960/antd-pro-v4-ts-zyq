export interface GetTestCaseParams {
  page?: number,
  size?: number,
  sort?: string | string[]
}

export interface CurrentRowParams {
  name?: string,
  id?: string,
  description?: string,
  sort?: number,
  enabled?: boolean,
  label?: string
}

export interface TableDataParams {
  name: string,
  id: string,
  description?: string,
  sort: number,
  enabled: boolean,
  label: string
}

export interface DelTestCases {
  id: string[]
}