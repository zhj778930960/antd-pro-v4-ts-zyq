
export interface MenuTreeDataType {
  name: string | null,
  id?: string,
  parentId?: string,
  icon?: string | null,
  hideInMenu?: boolean | null,
  path: string | null,
  children?: MenuTreeDataType[],
  redirect?: string,
  key: string
}


export interface TreesDataType extends MenuTreeDataType {
  key: string | number,
  children?: TreesDataType[],
}
