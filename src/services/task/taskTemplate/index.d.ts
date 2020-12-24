export interface GetAllTaskTemplatesType {
  page?: number;
  size?: number;
  sort?: string;
}


export interface DelOrCopyTaskTemplatesType {
  id: string
}

export interface AddTaskTemplatesType {
  name: string,
  enabled: boolean,
  notified_users: string,
  run_mode: string
}


export interface EditTaskTemplatesType extends AddTaskTemplatesType{
  [key: string]:any
}
