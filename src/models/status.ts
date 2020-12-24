export type StatusModelState = {
  [key in number | string]: {
    text: string;
    status: string;
  };
};

interface StatusModelType {
  namespace: 'status';
  state: StatusModelState;
  effects: {};
  reducer: {};
}

const StatusModel: StatusModelType = {
  namespace: 'status',
  state: {
    '-1': {
      text: '草稿',
      status: 'Default',
    },
    0: {
      text: '等待执行',
      status: 'Default',
    },
    1: {
      text: '执行中',
      status: 'Processing',
    },
    2: {
      text: '通过',
      status: 'Success',
    },
    3: {
      text: '不通过',
      status: 'Error',
    },
    4: {
      text: '中断',
      status: 'Warning',
    },
  },
  effects: {},
  reducer: {},
};

export default StatusModel;
