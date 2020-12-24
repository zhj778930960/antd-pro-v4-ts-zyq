import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Switch, Popconfirm, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllTaskTemplate } from '@/services/task/taskTemplate/index';
import { getAllChildren } from '@/services/system/dictionary/index';
import { EventMonitoringTable, AddEventMonitorings } from '@/services/task/monitoring/index.d';
import {
  getAllEventMonitorings,
  delEventMonitorings,
  editEventMonitorings,
} from '@/services/task/monitoring/index';
import { filterDictionaries, notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateEventMonitoring from './components/CreateEventMonitoring';

const { Option } = Select;
interface TaskTemplatesParams {
  name: string;
  id: string;
}

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

interface TableRequestParams {
  current?: number;
  pageSize?: number;
}

// 获取任务模板
const geTaskTemplates = async (setTaskTemplates: (data: TaskTemplatesParams[]) => void) => {
  const res = await getAllTaskTemplate({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTaskTemplates(res.data);
  }
};

// 获取字典项  事件类型event_type
const getEventTypes = async (setEventTypes: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'event_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setEventTypes(res.data);
  }
};

const filterRest = (rest: TableRequestParams) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });

  return info;
};

// 获取事件数据
const getEventMonitoring = async (params: TableRequestParams) => {
  const { current, pageSize: size, ...rest } = params;
  const restInfo = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...restInfo,
  };
  const res = await getAllEventMonitorings(info);
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    Object.assign(result, {
      data: list,
      total,
      success: true,
    });
  }
  return result;
};

interface CurrentRowParams {
  name?: string;
  type?: string;
  task_template_id?: string;
  enabled?: boolean;
  params?: {
    [key: string]: any;
  };
}

const editEventMonitoring = async (
  data: AddEventMonitorings,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await editEventMonitorings(data);
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('事务', '编辑', true);
  } else {
    notifyInfoTip('事务', '编辑', false, res.message);
  }
};

const changeEnabled = (
  e: boolean,
  row: EventMonitoringTable,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const info = JSON.parse(JSON.stringify(row));
  info.type = String(info.type);
  const params = {
    ...info,
    enabled: e ? 1 : 2,
  };
  editEventMonitoring(params, actionRef);
};

const delEventMonitoring = async (
  id: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delEventMonitorings({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('事务', '删除', true);
  } else {
    notifyInfoTip('事务', '删除', false, res.message);
  }
};

const filterTaskTemplates = (id: string, taskTemplates: TaskTemplatesParams[]) => {
  if (!id || taskTemplates.length === 0) return '';
  const arr = taskTemplates.filter((item) => item.id === id);
  if (arr.length === 0) return '';
  const { name } = arr[0];
  return name;
};

const EventMonitoring: React.FC<{}> = () => {
  const defaultForm = {
    name: undefined,
    type: undefined,
    task_template_id: undefined,
    enabled: true,
    params: {},
  };
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(false);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplatesParams[]>([]);
  const [eventTypes, setEventTypes] = useState<DictionaryDataParams[]>([]);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>({});
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    getEventTypes(setEventTypes);
    geTaskTemplates(setTaskTemplates);
  }, []);

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<EventMonitoringTable>[] = [
    {
      title: '事件名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '事件类型',
      dataIndex: 'type',
      width: 150,
      renderFormItem: () => (
        <Select placeholder="请选择" allowClear>
          {eventTypes &&
            eventTypes.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
        </Select>
      ),
      renderText: (text) => <span>{filterDictionaries(String(text), eventTypes)}</span>,
    },
    {
      title: '关联任务模板',
      dataIndex: 'task_template_id',
      renderFormItem: () => (
        <Select placeholder="请选择" allowClear>
          {taskTemplates &&
            taskTemplates.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      ),
      renderText: (text) => filterTaskTemplates(text, taskTemplates),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (_, row) => (
        <Switch
          checked={row.enabled === 1}
          unCheckedChildren="停用"
          checkedChildren="启用"
          onChange={(e) => {
            changeEnabled(e, row, actionRef);
          }}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'description',
      search: false,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      search: false,
      width: 170,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, row) => {
        return (
          <>
            <Button
              size="small"
              type="link"
              key="editBtn"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                const info = JSON.parse(JSON.stringify(row));
                info.type = info.type ? String(info.type) : undefined;
                info.params = JSON.parse(info.params);
                info.enabled = info.enabled === 1;
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              title={
                <div>
                  是否
                  <span className={styles.delColor}> 删除 </span>事件
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delEventMonitoring(row.id ?? '', actionRef);
              }}
            >
              <Button
                type="link"
                key="deleteButton"
                size="small"
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
        actionRef={actionRef}
        search={{
          labelWidth: 100,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="addBtn"
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
        request={(params) => getEventMonitoring(params)}
      />
      <CreateEventMonitoring
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        eventTypes={eventTypes}
        taskTemplates={taskTemplates}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
      />
    </PageContainer>
  );
};

export default EventMonitoring;
