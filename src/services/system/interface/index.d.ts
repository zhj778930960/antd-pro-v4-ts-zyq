export interface GetAllInterfaces {
  page?: number,
  size?: number,
  sort?: string
}

export interface EnableWathchBtn {
  enabled: boolean,
}

export interface WathchListParms {
  excluded_list: string,
  included_list: string
}