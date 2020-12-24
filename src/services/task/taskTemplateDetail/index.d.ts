export interface GetAllTaskTemplateTask {
  parent_id: string,
  [key: string]: any
}

export interface AddTaskTemplateTaskParams {
  content_type?: string,
  id?: string | null,
  name?: string,
  params?: string,
  parent_id?: string,
  [key?:string]: any
}

export interface AddTaskTemTaskChilds {
  content_id?: string,
  content_type?: string,
  name?: string,
  parent_id?: string,
  type?: string,
  id?: string
}

export interface DelTaskTemplateTaskParams {
  id: string
}

