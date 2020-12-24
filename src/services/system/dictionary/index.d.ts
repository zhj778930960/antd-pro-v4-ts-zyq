export interface DictionaryDataType {
  name: string,
  id: string,
  description: string,
  [key:string]: any
}

export interface GetDictionayParams {
  page?: number,
  size?: number,
  sort?: string | string[],
  [key: string]: any
}


export interface AddDictionaryParams {
  id?: string,
  name?: string,
  description?: string
}

export interface DelDictionaryParams {
  id: string[]
}

export interface AddDictChildParams {
  dictionary_id?: string,
  label?: string,
  value?: string,
  sort?: number,
  id?: string
}