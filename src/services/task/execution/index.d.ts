export interface GetAllExecutionsType {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ExecutionsType {
  id: string;
  name: string;
  start_time: string;
  status: number;
  duration: number;
  origin: number;
}

export interface DelExecutionType {
  id: string;
}

export interface BasicDealWithExecutionType {
  id?: string;
  run_mode?: string;
  task_template_id?: string | null;
}
export interface AddOrEditExecutionsType extends BasicDealWithExecutionType {
  notified_users: string;
}

export interface DealWithAEExecutionsType extends BasicDealWithExecutionType {
  notified_users: string[];
}
