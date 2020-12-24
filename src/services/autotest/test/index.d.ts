export interface GetTestChilrenCases {
  parent_id?: string,
  sort?: string,
  is_expanded?: boolean,
  page?: number,
  size?: number
}

export interface AddTestChilds {
  content_id?: string,
  content_type?: string,
  name?: string,
  parent_id?: string,
  type?: string,
  id?: string
}

export interface DelTestChilds {
  id?: string
}


export interface GetAllTestsParams {
  page?: number,
  size?: number,
  sort?: string
}

