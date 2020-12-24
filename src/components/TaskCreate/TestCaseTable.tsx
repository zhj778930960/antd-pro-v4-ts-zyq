import React, { useContext, useState, useRef, MutableRefObject } from 'react';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { getChildCases, delChilrens } from '@/services/autotest/test/index';
import { myContext } from '@/utils/commonContext';
import { getTaskTemplateTaskChilrenItems } from '@/services/task/taskTemplateDetail/index';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import TestCreate from './TestCreate';

interface CurrentRowParams {
  id?: string;
  type: string;
  name?: string;
  content_id: string[];
}

const getChildCase = async (caller: string, currentId?: string) => {
  const result = {
    data: [],
  };
  if (!currentId) return result;
  const params = {
    parent_id: currentId,
    sort: 'created_time,asc',
  };
  const res =
    caller === 'executionDetail'
      ? await getChildCases(params)
      : await getTaskTemplateTaskChilrenItems(params);
  if (res?.status === '00000') {
    Object.assign(result, {
      data: res.data,
      success: true,
    });
  }
  return result;
};

const delChildTasks = async (actionRef: MutableRefObject<ActionType | undefined>, id?: string) => {
  const res = await delChilrens({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试用例', '删除', true);
  } else {
    notifyInfoTip('测试用例', '删除', false, res.message);
  }
};

const TestCaseTable: React.FC<{}> = () => {
  const defaultForm = {
    type: '4',
    content_id: [],
  };
  const { currentId, caller }: any = useContext(myContext);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();
  const onModalCancel = () => {
    setCurrentRow(defaultForm);
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<CurrentRowParams>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      renderText: (text) => (text === 4 ? '用例' : '模块'),
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
              key="editBtn"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                const info = { ...row };
                info.type = String(info.type);
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              title={
                <div>
                  是否 <span className={styles.delColor}> 删除 </span>子项
                  <span className={styles.delColor}> {row.name} </span> ?
                </div>
              }
              onConfirm={() => delChildTasks(actionRef, row.id)}
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
    <>
      <ProTable
        search={false}
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="addBtn"
            onClick={() => {
              setModalTitleVisiable(true);
              setCurrentRow(defaultForm);
              setModalVisiable(true);
            }}
          >
            新建
          </Button>,
        ]}
        request={() => getChildCase(caller, currentId)}
      />
      <TestCreate
        modalVisiable={modalVisiable}
        modalTitleVisiable={modalTitleVisiable}
        currentRow={currentRow}
        onModalCancel={onModalCancel}
      />
    </>
  );
};

export default TestCaseTable;
