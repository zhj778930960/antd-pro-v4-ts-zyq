export interface TableItem {
  user_name: string,
  real_name: string,
  password: string,
  role: string | null,
  email: string,
  enabled: string | number,
  create_time?: string
}

export interface RestItemType {
  user_name?: string,
  real_name?: string,
}

export interface CreateFormColumn extends TableItem {
  id?: string
}

export interface EditFormColumn extends TableItem {
  id: string | undefined
}

export interface UsersParamsType {
  page?: number,
  size?: number,
  sort?: string
}

export interface UserDelType {
  id: (string | undefined)[]
}