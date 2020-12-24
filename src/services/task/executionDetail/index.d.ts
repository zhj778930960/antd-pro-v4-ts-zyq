export interface GelAllExecutionTaskParams {
  parent_id: string;
  sort?: string;
}

export interface DelExecutionTaskParams {
  id: string
}

export interface ExecutionDataParams {
  name: string,
  type: number,
  content_type: number,
  no: number | null,
  start_time: string | null,
  duration: number | null,
  status: number,
  params: string,
  id: string
}

export interface AddExecutionParams {
  content_type?: string,
  id?: string | null,
  name?: string,
  params?: string,
  parent_id?: string,
  [key?:string]: any
}