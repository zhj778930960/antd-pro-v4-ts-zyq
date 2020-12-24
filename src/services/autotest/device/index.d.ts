export interface GetDeviceListsParams {
  filter: any,
  options: any
}

export interface GetAutotestDevicesParams {
  page?: number,
  size?: number,
  sort?: string
}



export interface BasicParams {
  brand?: string,
  id?: string,
  model?: string,
  notes?: string,
  remote_address?: string,
  udid?: string
}

export interface CurrentRowParams  extends BasicParams{
  enabled?: boolean,
  updated_time?: string
}

export interface AddOrEditDeviceParams {
  enabled?: number
}

export interface DelDeviceParams {
  id?: string[]
}