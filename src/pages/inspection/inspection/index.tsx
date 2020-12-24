import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { InspectionDataType, GetAllInspectionType } from '@/services/inspection/inspection/index.d';
import {
  getAll,
  delInspection,
  copyInspection,
  executeInspection,
} from '@/services/inspection/inspection/index';
import { Button, Popconfirm, Select } from 'antd';
import { parseDuration, notifyInfoTip } from '@/utils/utils';
import { getAllChildren } from '@/services/system/dictionary/index';
import { PlusOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { StatusModelState } from '@/models/status';
import styles from './index.less';
import CreateInspection from './components/CreateInspection';

const { Option } = Select;
// 字典项接口
interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}

interface RestItemType {
  name?: string;
  hashes?: string;
}

interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

interface CurrentRowParams {
  name?: string;
  params: {
    platform?: string;
    build_type?: string;
    branch?: string;
    hashes?: string;
  };
  id?: string;
}

interface InspectionProps {
  taskStatus: StatusModelState;
}

/**
 *
 * @param list 请求回来的数据，用于判断是否需要开启轮询
 * @param actionRef Table ref 用于reload 表格
 * @param commonTimer 存储定时器用于，开启或者销毁定时器
 */

let commonTimer: number | null = null;
const tablePolling = (
  list: InspectionDataType[],
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  if (commonTimer) {
    window.clearTimeout(commonTimer as number);
  }
  if (list.length !== 0) {
    const hasExecuteing = list.some((item: InspectionDataType) => item.status === 1);
    if (hasExecuteing) {
      commonTimer = window.setTimeout(() => {
        actionRef.current?.reload();
      }, 1000 * 5);
    }
  }
};

/**
 *  去除getUsersList 方法中 rest 输入型参数为空字符串导致搜索有问题
 * @param rest Protable 中 requst 方法传递回来的params
 */
const filterRest = (rest: RestItemType) => {
  const restObj: RestItemType = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};
const getAllInspection = async (
  params: GetAllParamsType,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const { current, pageSize: size, ...rest } = params;
  const restParams = filterRest(rest);
  const info: GetAllInspectionType = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...restParams,
  };
  const res = await getAll(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    tablePolling(list, actionRef);
    result = {
      data: list,
      total,
    };
  }
  return result;
};

// 获取task_status 字典项
const getTaskStatusDictionary = async (
  setTaskStatusDict: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'task_status',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setTaskStatusDict(res.data);
  }
};

// 执行
const executeInspections = async (
  actionRef: MutableRefObject<ActionType | undefined>,
  id?: string,
) => {
  const res = await executeInspection({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('检查记录', '执行', true);
  } else {
    notifyInfoTip('检查记录', '执行', false, res.message);
  }
};

// 删除
const delInspections = async (actionRef: MutableRefObject<ActionType | undefined>, id?: string) => {
  const res = await delInspection({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('检查记录', '删除', true);
  } else {
    notifyInfoTip('检查记录', '删除', false, res.message);
  }
};

// 复制
const copyInspections = async (
  actionRef: MutableRefObject<ActionType | undefined>,
  id?: string,
) => {
  const res = await copyInspection({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('检查记录', '复制', true);
  } else {
    notifyInfoTip('检查记录', '复制', false, res.message);
  }
};

const Inspection: React.FC<InspectionProps> = (props) => {
  const { taskStatus } = props;
  const defaultForm = {
    name: undefined,
    params: {
      platform: undefined,
      build_type: undefined,
      branch: undefined,
      hashes: undefined,
    },
  };
  const [taskStatusDict, setTaskStatusDict] = useState<DictionariesParamsType[]>([]);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    getTaskStatusDictionary(setTaskStatusDict);
  }, []);

  const editRole = (row: InspectionDataType) => {
    const info = JSON.parse(JSON.stringify(row));
    info.params = JSON.parse(info.params);
    setCurrentRow(info);
    setModalTitleVisiable(false);
    setModalVisiable(true);
  };

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };
  const columns: ProColumns<InspectionDataType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, row) => {
        return (
          <Button
            type="link"
            size="small"
            key="turnto"
            onClick={() => {
              history.push(`/inspection/inspection/detail/${row.id}`);
            }}
          >
            {row.name}
          </Button>
        );
      },
    },
    {
      title: '库信息',
      dataIndex: 'hashes',
      ellipsis: true,
    },
    {
      title: '执行时间',
      dataIndex: 'start_time',
      width: 250,
      search: false,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      width: 200,
      search: false,
      renderText: (text) => parseDuration(text),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 200,
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
      valueEnum: taskStatus,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              disabled={row.status !== -1}
              style={{ paddingLeft: '0px' }}
              onClick={() => editRole(row)}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              disabled={row.status !== -1}
              key={`z${row.id}`}
              title={
                row.origin === 2 ? (
                  <div>
                    是否<span className={styles.executeRedColor}>执行</span>检查记录{' '}
                    <span className={styles.executeRedColor}>{row.name}</span> ?
                  </div>
                ) : (
                  '此任务由执行记录创建，请跳转至执行记录执行！'
                )
              }
              onConfirm={() => {
                if (row.origin === 2) {
                  executeInspections(actionRef, row.id);
                } else {
                  history.push('/task/execution');
                }
              }}
            >
              <Button type="link" key="deleteButton" size="small" disabled={row.status !== -1}>
                执行
              </Button>
            </Popconfirm>
            <Button
              type="link"
              key="copy"
              size="small"
              onClick={() => copyInspections(actionRef, row.id)}
            >
              复制
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              disabled={[0, 1].includes(row.status)}
              title={
                <div>
                  是否<span className={styles.delColor}>删除</span>检查记录{' '}
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delInspections(actionRef, row.id)}
            >
              <Button
                type="link"
                key="deleteButton"
                size="small"
                disabled={[0, 1].includes(row.status)}
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
      <ProTable<InspectionDataType>
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="createBtn"
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
        request={(params) => getAllInspection(params, actionRef)}
      />
      <CreateInspection
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
        caller="executionDetail"
      />
    </PageContainer>
  );
};

export default connect(({ status }: ConnectState) => ({
  taskStatus: status,
}))(Inspection);
