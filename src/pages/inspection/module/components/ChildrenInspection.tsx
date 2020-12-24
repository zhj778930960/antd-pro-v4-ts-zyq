import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Card, Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  getAllInspectionModuleItems,
  delInspectionModuleItems,
} from '@/services/inspection/module/index';
import { InspectionModuleDataType } from '@/services/inspection/module/index.d';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';
import CreateChildInspection from './CreateChildInspection';

interface GetDictionayParamsType {
  pageSize?: number;
  current?: number;
}

interface PropsParamsType {
  currentRow: InspectionModuleDataType;
}

// 获取字典项
const getAllInspectionModuleItem = async (
  params: GetDictionayParamsType,
  currentRow: InspectionModuleDataType,
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
  const res = await getAllInspectionModuleItems(info);

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
const delInspectionModuleItem = async (
  ids: string,
  actionChildrenRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delInspectionModuleItems({ id: [ids] });
  if (res?.status === '00000') {
    notifyInfoTip('检查项目', '删除', true);
    actionChildrenRef.current?.reload();
  } else {
    notifyInfoTip('检查项目', '删除', false, res.message);
  }
};

const ChildrenInspection: React.FC<PropsParamsType> = (props) => {
  const { currentRow } = props;
  const actionChildrenRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleVisible, setModalTitleVisible] = useState<boolean>(true);
  const childrenCurrentRow = {
    module_id: currentRow.id,
    id: '',
    label: '',
    value: '',
    sort: 999,
  };
  const [childrenRow, setChildrenRow] = useState<InspectionModuleDataType>(childrenCurrentRow);
  useEffect(() => {
    actionChildrenRef.current?.reload();
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
    actionChildrenRef.current?.reload();
  };

  // 点击编辑
  const editDictionary = (row: InspectionModuleDataType) => {
    setChildrenRow(row);
    setModalTitleVisible(false);
    setModalVisible(true);
  };
  const classificationChildren: ProColumns<InspectionModuleDataType>[] = [
    {
      title: '项目名称',
      dataIndex: 'item_name',
    },
    {
      title: '项目标识',
      dataIndex: 'item_label',
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
                  <span className={styles.delColor}> 删除 </span>检查项目
                  <span className={styles.delColor}>{row.label}</span> ?
                </div>
              }
              onConfirm={() => delInspectionModuleItem(row.id ?? '', actionChildrenRef)}
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
          actionRef={actionChildrenRef}
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
          request={(params) => getAllInspectionModuleItem(params, currentRow)}
        />
      </Card>
      <CreateChildInspection
        modalVisible={modalVisible}
        modalTitleVisible={modalTitleVisible}
        onCancelModal={onCancelChildrenModal}
        currentRowChild={childrenRow}
      />
    </>
  );
};

export default ChildrenInspection;
