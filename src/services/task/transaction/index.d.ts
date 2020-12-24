export interface GetTransactionsParams {
  page?: number,
  size?: number,
  sort?: string
}

export interface AddTransactionsParams {
  description?: string,
  doc_url?: string,
  enabled?: boolean,
  jenkins_scripts_branch?: string,
  label?: string,
  name?: string,
  sort?: number,
  type?: string
}