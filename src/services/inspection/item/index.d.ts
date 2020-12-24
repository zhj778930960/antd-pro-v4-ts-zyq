export interface GetInspectionItemParams {
  page?: number,
  size?: number,
  sort?: string
}


interface CurrentRowParamsType {
  key?: string,
  value?: string,
  type?: string,
  desc?: string
}

export interface BasicCurrentRowOrAddItem {
  name?: string,
  label?: string,
  transaction_id?: string,
  doc_url?: string,
  sort?: number,
  description?: string,

}
export interface CurrentRowParams extends BasicCurrentRowOrAddItem{
  enabled?: boolean,
  params: CurrentRowParamsType[]
}


export interface AddInspecntionItem extends BasicCurrentRowOrAddItem{
  id?: string,
  params: string,
  enabled?: number
}

export interface DelInspectionItem {
  id: string
}