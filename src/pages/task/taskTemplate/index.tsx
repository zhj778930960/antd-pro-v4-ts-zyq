import React, { useState, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import {
  getAllTaskTemplate,
  delTaskTemplates,
  copyTaskTemplates,
} from '@/services/task/taskTemplate/index';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateTaskTemplate from './components/CreateTaskTemplate';

interface TableColumnsParms {
  id: string;
  name: string;
  updated_time: string;
  label?: string;
}

interface GetTaskTemplatesParams {
  current?: number;
  pageSize?: number;
}

interface CurrentRowParams {
  name: string;
  run_mode: string;
  enabled: boolean;
  notified_users: string[];
}

const filterRest = (rest: GetTaskTemplatesParams) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });

  return info;
};

const getTaskTemplates = async (params: GetTaskTemplatesParams) => {
  const { current, pageSize: size, ...rest } = params;
  const restInfos = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...restInfos,
  };
  const res = await getAllTaskTemplate(info);
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    Object.assign(result, {
      data: list,
      total,
    });
  }

  return result;
};
// 删除模板
const delTaskTemplate = async (id: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delTaskTemplates({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('模板', '删除', true);
  } else {
    notifyInfoTip('模板', '删除', false, res.message);
  }
};
// 复制模板
const copyTaskTemplate = async (
  id: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await copyTaskTemplates({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('模板', '复制', true);
  } else {
    notifyInfoTip('模板', '复制', false, res.message);
  }
};

const TaskTemplate: React.FC<{}> = () => {
  const defaultForm = {
    name: '',
    run_mode: '1',
    notified_users: [],
    enabled: true,
  };

  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(false);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<TableColumnsParms>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (_, row) => (
        <Button
          type="link"
          size="small"
          key="turnto"
          onClick={() => {
            history.push(`/task/task_template/detail/${row.id}`);
          }}
        >
          {row.name}
        </Button>
      ),
    },
    {
      title: '内容数量',
      dataIndex: 'label',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      search: false,
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
              onClick={() => {
                const info = JSON.parse(JSON.stringify(row));
                info.notified_users = info.notified_users ? info.notified_users.split(',') : [];
                info.enabled = info.enabled === 1;
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Button
              key="copyBtn"
              type="link"
              size="small"
              onClick={() => copyTaskTemplate(row.id, actionRef)}
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
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delTaskTemplate(row.id, actionRef);
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
        request={(params) => getTaskTemplates(params)}
      />
      <CreateTaskTemplate
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
      />
    </PageContainer>
  );
};

export default TaskTemplate;
