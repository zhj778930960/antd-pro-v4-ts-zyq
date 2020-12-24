import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// 执行记录http
import {
  getAllExecutionList,
  delExecution,
  copyExecution,
  executeExecution,
} from '@/services/task/execution/index';
// 执行记录interface
import { ExecutionsType, DealWithAEExecutionsType } from '@/services/task/execution/index.d';
// 字典项接口
import { getAllChildren } from '@/services/system/dictionary/index';
// 工具函数
import { parseDuration, notifyInfoTip } from '@/utils/utils';
import { history, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { StatusModelState } from '@/models/status';
import styles from './index.less';
import CreateExecution from './components/CreateExecution';

const { Option } = Select;
interface GetAllExecutionsParams {
  current?: number;
  pageSize?: number;
}

interface TaskStatusType {
  label: string;
  id: string;
  value: string;
}

interface GetTaskStatusDictionaryParams {
  setTaskStatusDict: (data: TaskStatusType[]) => void;
}

interface ExecutionProps {
  taskStatus: StatusModelState;
}

const finterRest = (rest: GetAllExecutionsParams) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });
  return info;
};

let commonTimer: number | null = null;
const tablePolling = (
  list: ExecutionsType[],
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  if (commonTimer) {
    window.clearTimeout(commonTimer as number);
  }
  if (list.length !== 0) {
    const hasExecuteing = list.some((item: ExecutionsType) => item.status === 1);
    if (hasExecuteing) {
      commonTimer = window.setTimeout(() => {
        actionRef.current?.reload();
      }, 1000 * 5);
    }
  }
};

const getAllExecutions = async (
  params: GetAllExecutionsParams,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const { current, pageSize: size, ...rest } = params;
  const filRests = finterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...filRests,
  };
  const res = await getAllExecutionList(info);
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    tablePolling(list, actionRef);
    Object.assign(result, {
      data: list,
      total,
      success: true,
    });
  }
  return result;
};

// 获取task_status 字典项
const getTaskStatusDictionary = async ({ setTaskStatusDict }: GetTaskStatusDictionaryParams) => {
  // const  = params
  const res = await getAllChildren({
    dictName: 'task_status',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setTaskStatusDict(res.data);
  }
};

// 删除执行记录
const delExecutions = async (id: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delExecution({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('执行记录', '删除', true);
  } else {
    notifyInfoTip('执行记录', '删除', false, res.message);
  }
};

// 复制执行记录
const copyExecutions = async (id: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await copyExecution({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('执行记录', '复制', true);
  } else {
    notifyInfoTip('执行记录', '复制', false, res.message);
  }
};

// 执行 执行记录
const executeExecutions = async (
  id: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await executeExecution({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('执行记录', '执行', true);
  } else {
    notifyInfoTip('执行记录', '执行', false, res.message);
  }
};

const Execution: React.FC<ExecutionProps> = (props) => {
  const { taskStatus } = props;
  const defaultForm = {
    id: '',
    run_mode: '1',
    notified_users: [],
    task_template_id: null,
  };
  const [taskStatusDict, setTaskStatusDict] = useState<TaskStatusType[]>([]);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<DealWithAEExecutionsType>(defaultForm);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    getTaskStatusDictionary({ setTaskStatusDict });
  }, []);

  // 取消弹框
  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<ExecutionsType>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (_, row) => (
        <Button
          type="link"
          size="small"
          key="turnto"
          onClick={() => {
            history.push(`/task/execution/detail/${row.id}`);
          }}
        >
          {row.name}
        </Button>
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      search: false,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      renderText: (text) => parseDuration(text),
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: taskStatus,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            {taskStatusDict &&
              taskStatusDict.map((item) => {
                return (
                  <Option key={item.id} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (_, row) => {
        return (
          <>
            <Button
              key="editBtn"
              type="link"
              style={{ paddingLeft: '0px' }}
              size="small"
              disabled={row.status !== -1}
              onClick={() => {
                const info = JSON.parse(JSON.stringify(row));
                info.notified_users = info.notified_users ? info.notified_users.split(',') : [];
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={`z${row.id}`}
              disabled={row.status !== -1}
              title={
                <div>
                  是否
                  <span className={styles.executeRedColor}> 执行 </span>执行记录
                  <span className={styles.executeRedColor}>{row.name}</span> ?
                </div>
              }
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                executeExecutions(row.id, actionRef);
              }}
            >
              <Button
                type="link"
                disabled={row.status !== -1}
                key="executeButton"
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                执行
              </Button>
            </Popconfirm>
            <Button
              key="copyBtn"
              type="link"
              size="small"
              onClick={() => copyExecutions(row.id, actionRef)}
            >
              复制
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              title={
                <div>
                  是否
                  <span className={styles.delColor}> 删除 </span>执行记录
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              disabled={[0, 1].includes(row.status)}
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delExecutions(row.id, actionRef);
              }}
            >
              <Button
                type="link"
                key="deleteButton"
                size="small"
                disabled={[0, 1].includes(row.status)}
                onClick={(e) => e.stopPropagation()}
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="createBtn"
            type="primary"
            onClick={() => {
              setCurrentRow(defaultForm);
              setModalTitleVisiable(true);
              setModalVisiable(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        actionRef={actionRef}
        request={(params) => getAllExecutions(params, actionRef)}
      />
      <CreateExecution
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
      />
    </PageContainer>
  );
};

export default connect(({ status }: ConnectState) => ({
  taskStatus: status,
}))(Execution);
