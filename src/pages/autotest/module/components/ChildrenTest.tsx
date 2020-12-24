import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Card, Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllTestModuleCases, delTestModuleCases } from '@/services/autotest/module/index';

import { TestModuleDataType } from '@/services/autotest/module/index.d';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';
import CreateChildTest from './CreateChildTest';

interface GetDictionayParamsType {
  pageSize?: number;
  current?: number;
}

interface PropsParamsType {
  currentRow: TestModuleDataType;
}

// 获取测试用例
const getAllTestModuleCase = async (
  params: GetDictionayParamsType,
  currentRow: TestModuleDataType,
) => {
  const { current, pageSize: size } = params;
  let result = {
    data: [],
    total: 0,
  };
  if (!currentRow?.id) return result;
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: ['sort,asc', 'created_time,desc'],
    module_id: currentRow?.id,
  };
  const res = await getAllTestModuleCases(info);

  if (res?.status === '00000') {
    const { list, total } = res.data;
    result = {
      data: list,
      total,
    };
  }
  return result;
};

// 删除
const delTestModuleCase = async (
  ids: string,
  actioChildrenRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delTestModuleCases({ id: [ids] });
  if (res?.status === '00000') {
    notifyInfoTip('测试用例', '删除', true);
    actioChildrenRef.current?.reload();
  } else {
    notifyInfoTip('测试用例', '删除', false, res.message);
  }
};

const ChildrenTest: React.FC<PropsParamsType> = (props) => {
  const { currentRow } = props;
  const actioChildrenRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleVisible, setModalTitleVisible] = useState<boolean>(true);
  const childrenCurrentRow = {
    module_id: currentRow.id,
    id: undefined,
    label: undefined,
    value: undefined,
    sort: 999,
    case_id: [],
  };
  const [childrenRow, setChildrenRow] = useState<TestModuleDataType>(childrenCurrentRow);
  useEffect(() => {
    actioChildrenRef.current?.reload();
  }, [currentRow]);

  // 打开新建
  const onOpenCreateModal = () => {
    setChildrenRow(childrenCurrentRow);
    setModalTitleVisible(true);
    setModalVisible(true);
  };

  // 点击关闭
  const onCancelChildrenModal = () => {
    setModalTitleVisible(true);
    setModalVisible(false);
    actioChildrenRef.current?.reload();
  };

  // 点击编辑
  const editDictionary = (row: TestModuleDataType) => {
    setChildrenRow(row);
    setModalTitleVisible(false);
    setModalVisible(true);
  };
  const classificationChildren: ProColumns<TestModuleDataType>[] = [
    {
      title: '用例名称',
      dataIndex: ['case', 'name'],
      ellipsis: true,
    },
    {
      title: '用例标识',
      dataIndex: ['case', 'label'],
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 100,
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="childEdit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => editDictionary(row)}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={`cd${row.id}`}
              title={
                <div>
                  是否
                  <span className={styles.delColor}> 删除 </span>测试用例
                  <span className={styles.delColor}>{row.case.label}</span> ?
                </div>
              }
              onConfirm={() => delTestModuleCase(row.id ?? '', actioChildrenRef)}
            >
              <Button type="link" key="childDeleteButton" size="small">
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
      <Card title="模块详情">
        <ProTable
          actionRef={actioChildrenRef}
          rowKey="id"
          columns={classificationChildren}
          search={false}
          toolBarRender={() => [
            <Button
              key="childrenCreate"
              type="primary"
              onClick={onOpenCreateModal}
              disabled={!currentRow.id}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={(params) => getAllTestModuleCase(params, currentRow)}
        />
      </Card>
      <CreateChildTest
        modalVisible={modalVisible}
        modalTitleVisible={modalTitleVisible}
        onCancelModal={onCancelChildrenModal}
        currentRowChild={childrenRow}
      />
    </>
  );
};

export default ChildrenTest;
