import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { parseDuration, filterDictionaries, notifyInfoTip } from '@/utils/utils';
import { getAllExecutionTask, delExecutionTask } from '@/services/task/executionDetail/index';
import { ExecutionDataParams } from '@/services/task/executionDetail/index.d';
import { Button, Popconfirm, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// 字典项接口
import { getAllChildren } from '@/services/system/dictionary/index';
import CreateTask from '@/components/TaskCreate/CreateTask';
import { history, useParams, connect } from 'umi';

import { ConnectState } from '@/models/connect';
import { StatusModelState } from '@/models/status';
import styles from './index.less';

const { Option } = Select;

interface RouterUrlParams {
  id: string;
}

interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

interface CurrentRowParams {
  id?: string;
  content_type?: string | null;
  params?: any;
}

interface ExecutionDetailProps {
  taskStatus: StatusModelState;
}
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

// 获取task_content_type 字典项
const getTaskContentTypeDictionary = async (
  setTaskContentType: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'task_content_type',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setTaskContentType(res.data);
  }
};

// 获取任务
const getAllExecutionTasks = async (params: {}, parent_id: string) => {
  const info = {
    parent_id,
    sort: 'created_time,desc',
    ...params,
  };
  const res = await getAllExecutionTask(info);
  const result = {
    data: [],
  };
  if (res?.status === '00000') {
    Object.assign(result, {
      data: res.data,
      success: true,
    });
  }
  return result;
};

const delExecutionsTasks = async (
  id: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delExecutionTask({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('任务', '删除', true);
  } else {
    notifyInfoTip('任务', '删除', false, res.message);
  }
};

const dealWithCurrentRow = (row: ExecutionDataParams) => {
  const info = JSON.parse(JSON.stringify(row));
  info.content_type = String(info.content_type);
  if (['1', '2', '3'].includes(info.content_type)) {
    info.params = JSON.parse(info.params);
    if (info.content_type === '3') {
      info.params.device_list = info.params?.device_list.split(',');
    }
  }
  return info;
};

const ExecutionDetail: React.FC<ExecutionDetailProps> = (props) => {
  const { taskStatus } = props;
  const defaultForm = {
    id: '',
    content_type: null,
  };

  const urlParams: RouterUrlParams = useParams();
  const [taskStatusDict, setTaskStatusDict] = useState<DictionariesParamsType[]>([]);
  const [taskContentType, setTaskContentType] = useState<DictionariesParamsType[]>([]);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    getTaskStatusDictionary(setTaskStatusDict);
    getTaskContentTypeDictionary(setTaskContentType);
  }, []);

  const columns: ProColumnType<ExecutionDataParams>[] = [
    {
      title: '内容名称',
      dataIndex: 'name',
      render: (_, row) => {
        return (
          <>
            {[1, 3].includes(row.content_type) && (
              <Button
                type="link"
                size="small"
                key="turnto"
                onClick={() => {
                  const title = row.content_type === 1 ? 'inspection' : 'autotest';
                  history.push(`/task/execution/${title}/task/detail/${row.id}`);
                }}
              >
                {row.name}
              </Button>
            )}
            {![1, 3].includes(row.content_type) && <span>{row.name}</span>}
          </>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'content_type',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            {taskContentType &&
              taskContentType.map((item) => {
                return (
                  <Option key={item.id} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
          </Select>
        );
      },
      renderText: (text) => <span>{filterDictionaries(String(text), taskContentType)}</span>,
    },
    {
      title: '版本号',
      dataIndex: 'no',
      search: false,
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
      valueType: 'option',
      fixed: 'right',
      width: 150,
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
                const info = dealWithCurrentRow(row);
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              key="log"
              size="small"
              onClick={() => window.open(`/task/log/${row.id}`, '_blank')}
            >
              日志
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
                delExecutionsTasks(row.id, actionRef);
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
  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        pagination={false}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            key="createBtn"
            type="primary"
            onClick={() => {
              setModalTitleVisiable(true);
              setCurrentRow(defaultForm);
              setModalVisiable(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        request={(params) => getAllExecutionTasks(params, urlParams.id)}
      />
      <CreateTask
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        taskContentType={taskContentType}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
        caller="executionDetail"
      />
    </PageContainer>
  );
};

export default connect(({ status }: ConnectState) => ({
  taskStatus: status,
}))(ExecutionDetail);
