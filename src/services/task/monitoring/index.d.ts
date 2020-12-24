export interface EventMonitoringTable {
  name?: string,
  type?: number,
  task_template_id?: string,
  enabled?: number | boolean,
  description?: string,
  params? :string,
  created_time?: string,
  branch_pattern?: string
  id?: string
}

export interface GetAllEventMonitorings {
  page?: number,
  size?: number,
  srot?: string,
  id?:string
}

export interface AddEventMonitorings {
  branch_pattern?: string
  enabled?: number | boolean,
  name?: string
  params?: string
  task_template_id?: string
  type?: string
}

export interface OneIdEventMonitoring {
  id?: string,
  repository_id?: string
}