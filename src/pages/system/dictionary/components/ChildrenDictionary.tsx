import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Card, Button, Popconfirm } from 'antd';
import {
  DictionaryDataType,
  GetDictionayParams,
  AddDictChildParams,
} from '@/services/system/dictionary/index.d';
import { getAllChildren, delChild } from '@/services/system/dictionary/index';
import { PlusOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';
import CreateChildDictionary from './CreateChildDictionary';

interface GetDictionayParamsType {
  pageSize?: number;
  current?: number;
}

interface PropsParamsType {
  currentRow: DictionaryDataType;
}

// 获取字典项
const getAllDictionaryChildren = async (
  params: GetDictionayParamsType,
  currentRow: DictionaryDataType,
) => {
  const { current, pageSize: size } = params;
  let result = {
    data: [],
    total: 0,
  };
  if (!currentRow?.id) return result;
  const info: GetDictionayParams = {
    page: current ? current - 1 : 0,
    size,
    sort: ['sort,asc', 'created_time,desc'],
    dictName: currentRow?.name,
  };
  const res = await getAllChildren(info);

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
const delDictionary = async (
  ids: string,
  actioChildrenRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delChild({ id: [ids] });
  if (res?.status === '00000') {
    notifyInfoTip('字典项', '删除', true);
    actioChildrenRef.current?.reload();
  } else {
    notifyInfoTip('字典项', '删除', false, res.message);
  }
};

const Dictionary: React.FC<PropsParamsType> = (props) => {
  const { currentRow } = props;
  const actioChildrenRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleVisible, setModalTitleVisible] = useState<boolean>(true);
  const childrenCurrentRow = {
    dictionary_id: currentRow.id,
    id: '',
    label: '',
    value: '',
    sort: 999,
  };
  const [childrenRow, setChildrenRow] = useState<AddDictChildParams>(childrenCurrentRow);
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
  const editDictionary = (row: AddDictChildParams) => {
    setChildrenRow(row);
    setModalTitleVisible(false);
    setModalVisible(true);
  };
  const classificationChildren: ProColumns<AddDictChildParams>[] = [
    {
      title: '字典标签',
      dataIndex: 'label',
    },
    {
      title: '字典值',
      dataIndex: 'value',
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
                  <span className={styles.delColor}> 删除 </span>字典项
                  <span className={styles.delColor}>{row.label}</span> ?
                </div>
              }
              onConfirm={() => delDictionary(row.id ?? '', actioChildrenRef)}
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
      <Card title="字典详情">
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
          request={(params) => getAllDictionaryChildren(params, currentRow)}
        />
      </Card>
      <CreateChildDictionary
        modalVisible={modalVisible}
        modalTitleVisible={modalTitleVisible}
        onCancelModal={onCancelChildrenModal}
        currentRow={childrenRow}
      />
    </>
  );
};

export default Dictionary;
