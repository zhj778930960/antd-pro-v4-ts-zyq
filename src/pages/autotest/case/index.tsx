import React, { useState, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, Switch } from 'antd';
import {
  getAllTestCases,
  delTestCases,
  syncTestCases,
  editTestCases,
} from '@/services/autotest/case';
import { TableDataParams, CurrentRowParams } from '@/services/autotest/case/index.d';
import { PlusOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateCase from './components/CreateCase';

interface GetCasesParams {
  current?: number;
  pageSize?: number;
}

const filterRest = (rest: GetCasesParams) => {
  const restObj: GetCasesParams = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

const getAllTestCase = async (params: GetCasesParams) => {
  const { current, pageSize: size, ...rest } = params;
  const info = filterRest(rest);
  const reqInfo = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...info,
  };
  const res = await getAllTestCases(reqInfo);

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

const delTestCase = async (ids: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delTestCases({ id: [ids] });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试用例', '删除', true);
  } else {
    notifyInfoTip('测试用例', '删除', false, res.message);
  }
};

const changeSwitch = async (
  bool: boolean,
  row: CurrentRowParams,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const params = {
    ...row,
    enabled: bool,
  };
  const res = await editTestCases(params);
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试用例', `${bool ? '启用' : '停用'}`, true);
  } else {
    notifyInfoTip('测试用例', `${bool ? '启用' : '停用'}`, false, res.message);
  }
};

const syncTestCase = async (actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await syncTestCases();
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试用例', '同步', true);
  } else {
    notifyInfoTip('测试用例', '同步', false, res.message);
  }
};

const TestCase: React.FC<{}> = () => {
  const defaultForm = {
    name: undefined,
    id: undefined,
    sort: 999,
    enabled: true,
    label: undefined,
    description: undefined,
  };
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<TableDataParams>[] = [
    {
      title: '用例名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '用例标识',
      dataIndex: 'label',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 200,
      render: (_, row) => {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={row.enabled}
            onChange={(bool) => changeSwitch(bool, row, actionRef)}
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
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
              type="link"
              key="edit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
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
                  是否<span className={styles.delColor}>删除</span>测试用例
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delTestCase(row.id, actionRef)}
            >
              <Button type="link" key="deleteButton" size="small">
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
          <Popconfirm
            trigger="click"
            key="syncPop"
            title={<div>是否同步测试用例</div>}
            onConfirm={() => syncTestCase(actionRef)}
          >
            <Button type="default" key="syncBtn">
              <CloudSyncOutlined />
              同步
            </Button>
          </Popconfirm>,
        ]}
        request={(params) => getAllTestCase(params)}
      />
      <CreateCase
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        currentRow={currentRow}
        onModalCancel={onModalCancel}
      />
    </PageContainer>
  );
};

export default TestCase;
