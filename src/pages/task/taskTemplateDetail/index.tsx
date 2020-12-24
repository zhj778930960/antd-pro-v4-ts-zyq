import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import {
  getAllTaskTemplateTasks,
  delTaskTemplateTasks,
} from '@/services/task/taskTemplateDetail/index';
import { Button, Select, Popconfirm } from 'antd';
// 字典项接口
import { getAllChildren } from '@/services/system/dictionary/index';
import { filterDictionaries, notifyInfoTip } from '@/utils/utils';
import CreateTask from '@/components/TaskCreate/CreateTask';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
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

interface TaskTemplateDetailColumns {
  name: string;
  id: string;
  content_type: string;
}

interface CurrentRowParams {
  id?: string;
  content_type?: string | null;
  params?: any;
}

const getTaskTemplateTasks = async (id: string) => {
  const res = await getAllTaskTemplateTasks({
    parent_id: id,
    sort: 'created_time,desc',
  });
  const result = {
    data: [],
  };
  if (res?.status === '00000') {
    Object.assign(result, {
      data: res.data,
    });
  }

  return result;
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

const delExecutionsTasks = async (
  id: string,
  actionRef: React.MutableRefObject<ActionType | undefined>,
) => {
  const res = await delTaskTemplateTasks({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('任务', '删除', true);
  } else {
    notifyInfoTip('任务', '删除', false, res.message);
  }
};
const dealWithCurrentRow = (row: CurrentRowParams) => {
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

const TaskTemplateDetail: React.FC<{}> = () => {
  const defaultForm = {
    id: '',
    content_type: null,
  };
  const urlParams: RouterUrlParams = useParams();
  const [taskContentType, setTaskContentType] = useState<DictionariesParamsType[]>([]);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    getTaskContentTypeDictionary(setTaskContentType);
  }, []);
  const columns: ProColumnType<TaskTemplateDetailColumns>[] = [
    {
      title: '内容名称',
      dataIndex: 'name',
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
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, row) => {
        return (
          <>
            <Button
              key="editBtn"
              type="link"
              style={{ paddingLeft: '0px' }}
              size="small"
              onClick={() => {
                const info = dealWithCurrentRow(row);
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
                  <span className={styles.delColor}> 删除 </span>任务模板子项
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
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
        rowKey="id"
        columns={columns}
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
        request={() => getTaskTemplateTasks(urlParams.id)}
        pagination={false}
      />
      <CreateTask
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        taskContentType={taskContentType}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
        caller="taskTemplate"
      />
    </PageContainer>
  );
};

export default TaskTemplateDetail;
