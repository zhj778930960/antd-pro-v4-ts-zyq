import React, { useState, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import {
  getAllRepository,
  delRepository,
  editRepository,
} from '@/services/project/repository/index';
import { RepositoryTableData } from '@/services/project/repository/index.d';
import { Button, Popconfirm, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateRepository from './components/CreateRepository';

interface RequestParamsType {
  current?: number;
  pageSize?: number;
}

const filterRest = (rest: RequestParamsType) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });
  return info;
};

const getAllRepositories = async (params: RequestParamsType) => {
  const { current, pageSize: size, ...rest } = params;
  const filterParams = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...filterParams,
  };
  const res = await getAllRepository(info);
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

// 删除
const delRepositories = async (
  ids: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delRepository({
    id: [ids],
  });
  if (res?.status === '00000') {
    notifyInfoTip('源码仓库', '删除', true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('源码仓库', '删除', false, res.message);
  }
};

// 更改状态
const changeSwitch = async (
  enabled: boolean,
  row: RepositoryTableData,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const params = {
    ...row,
    ...{ enabled },
  };
  const res = await editRepository(params);
  if (res?.status === '00000') {
    notifyInfoTip('源码仓库', `${enabled ? '开启' : '关闭'}`, true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('源码仓库', `${enabled ? '开启' : '关闭'}`, false, res.message);
  }
};

const Repository: React.FC<{}> = () => {
  const defaultForm = {
    name: '',
    label: '',
    git_url: '',
    gitlab_project_id: '',
    notes: '',
    token: '',
    enabled: 1,
  };
  const actionRef = useRef<ActionType>();
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<RepositoryTableData>(defaultForm);

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };
  const columns: ProColumnType<RepositoryTableData>[] = [
    {
      title: '仓库名称',
      dataIndex: 'name',
    },
    {
      title: '仓库标识',
      dataIndex: 'label',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      search: false,
      render: (_, row) => {
        return (
          <Switch
            checked={row.enabled === 1}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={(e) => changeSwitch(e, row, actionRef)}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentRow(row);
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
                  <span className={styles.delColor}> 删除 </span>字典
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delRepositories(row.id ?? '', actionRef);
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
        actionRef={actionRef}
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
        request={(params) => getAllRepositories(params)}
      />
      <CreateRepository
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
      />
    </PageContainer>
  );
};

export default Repository;
