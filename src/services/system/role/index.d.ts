export interface RoleDataType {
  id?: number;
  name: string;
  privileges: string[] | string;
}

export interface GetAllRolesType {
  page?: number;
  per_page?: number;
}

export interface RoleObjType {
  text: string;
  status?: string;
}
export interface RoleValueEnum {
  [key: string]: RoleObjType;
}
