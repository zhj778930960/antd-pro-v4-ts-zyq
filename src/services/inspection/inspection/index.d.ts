export interface InspectionDataType {
  name: string;
  id: string;
  hashes: string;
  start_time: string;
  duration: number;
  status: number;
  origin: number;
  params: string;
}

export interface GetAllInspectionType {
  page?: number;
  size?: number;
  sort?: string;
}

export interface GetInspectionChilrenItems {
  parent_id?: string;
  sort?: string;
  is_expanded?: boolean;
  id?: string;
}

export interface AddInspectionChilds {
  content_id?: string;
  content_type?: string;
  name?: string;
  parent_id?: string;
  type?: string;
  id?: string;
}

export interface DelInspectionChilds {
  id?: string;
}

export interface AddOrEditInspection {
  content_type?: string;
  name?: string;
  id?: string;
  params?: string;
}

export interface DelOrCopyOrExcuteParams {
  id?: string;
}

export interface NotifyEwechatParams {
  content: string;
  tousers: string;
}
