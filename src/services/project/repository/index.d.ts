export interface GetAllRepository {
  page?: number;
  size?: number;
  sort?: string;
}

export interface RepositoryTableData {
  name?: string;
  label?: string;
  git_url?: string;
  gitlab_project_id?: string;
  notes?: string;
  token?: string;
  enabled?: number | boolean;
  id?: string;
}

export interface DelRepositoryType {
  id: string[];
}
